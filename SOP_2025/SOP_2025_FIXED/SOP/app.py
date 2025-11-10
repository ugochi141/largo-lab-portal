"""
Kaiser Permanente SOP Management System
Advanced Python application for laboratory SOP management
"""

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
import json
from pathlib import Path

# Application Configuration
class Config:
    SECRET_KEY = 'kp-largo-lab-sop-management-2025'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///kp_sop_database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# Initialize Flask Application
app = Flask(__name__)
app.config.from_object(Config)

# Initialize Extensions
database = SQLAlchemy(app)
auth_manager = LoginManager()
auth_manager.init_app(app)
auth_manager.login_view = 'user_login'

# Database Models
class KPUser(UserMixin, database.Model):
    __tablename__ = 'kp_users'

    id = database.Column(database.Integer, primary_key=True)
    employee_id = database.Column(database.String(20), unique=True, nullable=False)
    full_name = database.Column(database.String(100), nullable=False)
    email_address = database.Column(database.String(120), unique=True, nullable=False)
    password_hash = database.Column(database.String(255), nullable=False)
    position_title = database.Column(database.String(100), nullable=False)
    department_name = database.Column(database.String(50), nullable=False)
    access_level = database.Column(database.String(20), default='staff')
    hire_date = database.Column(database.DateTime, default=datetime.utcnow)
    is_active = database.Column(database.Boolean, default=True)

    def create_password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def has_permission(self, permission_type):
        permissions = {
            'admin': ['create', 'edit', 'approve', 'delete', 'view'],
            'supervisor': ['create', 'edit', 'view'],
            'staff': ['view']
        }
        return permission_type in permissions.get(self.access_level, [])

class SOPDocument(database.Model):
    __tablename__ = 'sop_documents'

    id = database.Column(database.Integer, primary_key=True)
    document_identifier = database.Column(database.String(50), unique=True, nullable=False)
    procedure_title = database.Column(database.String(200), nullable=False)
    laboratory_department = database.Column(database.String(50), nullable=False)
    version_number = database.Column(database.String(10), default='1.0')
    document_status = database.Column(database.String(20), default='draft')
    content_sections = database.Column(database.Text)
    author_id = database.Column(database.Integer, database.ForeignKey('kp_users.id'), nullable=False)
    creation_timestamp = database.Column(database.DateTime, default=datetime.utcnow)
    modification_timestamp = database.Column(database.DateTime, default=datetime.utcnow)
    effective_date = database.Column(database.DateTime)
    review_due_date = database.Column(database.DateTime)
    approver_id = database.Column(database.Integer, database.ForeignKey('kp_users.id'))
    approval_timestamp = database.Column(database.DateTime)

    # Relationships
    document_author = database.relationship('KPUser', foreign_keys=[author_id], backref='authored_documents')
    document_approver = database.relationship('KPUser', foreign_keys=[approver_id], backref='approved_documents')

    def get_sections_data(self):
        if self.content_sections:
            return json.loads(self.content_sections)
        return self.get_default_sections()

    def save_sections_data(self, sections_dict):
        self.content_sections = json.dumps(sections_dict)

    @staticmethod
    def get_default_sections():
        """Kaiser Permanente 23 Standard Sections"""
        return {
            'purpose': '',
            'clinical_significance': '',
            'scope': '',
            'responsibilities': '',
            'safety_requirements': '',
            'specimen_requirements': '',
            'reagents_and_supplies': '',
            'equipment': '',
            'maintenance': '',
            'quality_control_requirements': '',
            'calibration': '',
            'troubleshooting': '',
            'test_procedure': '',
            'calculations_and_result_reporting': '',
            'reference_ranges': '',
            'critical_values': '',
            'limitations_and_interferences': '',
            'emergency_procedures': '',
            'technical_support': '',
            'quality_assurance': '',
            'regulatory_compliance': '',
            'downtime_procedures': '',
            'references': ''
        }

# Authentication Helper
@auth_manager.user_loader
def load_user_session(user_id):
    return KPUser.query.get(int(user_id))

# SOP Management Class
class SOPManager:
    @staticmethod
    def generate_document_code(department, procedure_type):
        dept_codes = {
            'HEMATOLOGY': 'HEM',
            'CHEMISTRY': 'CHEM',
            'COAGULATION': 'COAG',
            'URINALYSIS': 'URIN',
            'MICROBIOLOGY': 'MICRO',
            'PHLEBOTOMY': 'PHLEB',
            'POCT': 'POCT',
            'SAFETY': 'SAFE'
        }

        dept_code = dept_codes.get(department.upper(), 'GEN')
        existing_docs = SOPDocument.query.filter(
            SOPDocument.document_identifier.like(f'MAS.LAB.{dept_code}.%')
        ).count()

        next_number = str(existing_docs + 1).zfill(3)
        return f'MAS.LAB.{dept_code}.{next_number}'

# Application Routes
@app.route('/')
def homepage():
    if current_user.is_authenticated:
        return redirect(url_for('main_dashboard'))
    return render_template('authentication.html')

@app.route('/login', methods=['GET', 'POST'])
def user_login():
    if request.method == 'POST':
        employee_id = request.form.get('employee_id')
        password = request.form.get('password')

        user = KPUser.query.filter_by(employee_id=employee_id).first()

        if user and user.verify_password(password) and user.is_active:
            login_user(user)
            flash(f'Welcome back, {user.full_name}!', 'success')
            return redirect(url_for('main_dashboard'))
        else:
            flash('Invalid credentials or inactive account', 'error')

    return render_template('authentication.html')

@app.route('/logout')
@login_required
def user_logout():
    logout_user()
    flash('Successfully logged out', 'info')
    return redirect(url_for('user_login'))

@app.route('/dashboard')
@login_required
def main_dashboard():
    user_department_sops = SOPDocument.query.filter_by(
        laboratory_department=current_user.department_name
    ).all()

    recent_sops = SOPDocument.query.order_by(
        SOPDocument.modification_timestamp.desc()
    ).limit(10).all()

    total_sops = SOPDocument.query.count()
    active_sops = SOPDocument.query.filter_by(document_status='active').count()
    draft_sops = SOPDocument.query.filter_by(document_status='draft').count()
    review_sops = SOPDocument.query.filter_by(document_status='review').count()

    dashboard_data = {
        'user_sops': user_department_sops,
        'recent_updates': recent_sops,
        'statistics': {
            'total': total_sops,
            'active': active_sops,
            'draft': draft_sops,
            'review': review_sops
        }
    }

    return render_template('dashboard.html', data=dashboard_data)

@app.route('/sop/create', methods=['GET', 'POST'])
@login_required
def create_sop():
    if not current_user.has_permission('create'):
        flash('Insufficient permissions to create SOPs', 'error')
        return redirect(url_for('main_dashboard'))

    if request.method == 'POST':
        title = request.form.get('title')
        department = request.form.get('department')

        doc_code = SOPManager.generate_document_code(department, 'procedure')

        new_sop = SOPDocument(
            document_identifier=doc_code,
            procedure_title=title,
            laboratory_department=department,
            author_id=current_user.id,
            review_due_date=datetime.utcnow() + timedelta(days=365)
        )

        new_sop.save_sections_data(SOPDocument.get_default_sections())

        database.session.add(new_sop)
        database.session.commit()

        flash(f'SOP {doc_code} created successfully', 'success')
        return redirect(url_for('edit_sop', sop_id=new_sop.id))

    departments = ['HEMATOLOGY', 'CHEMISTRY', 'COAGULATION', 'URINALYSIS',
                  'MICROBIOLOGY', 'PHLEBOTOMY', 'POCT', 'SAFETY']

    return render_template('create_sop.html', departments=departments)

@app.route('/sop/<int:sop_id>')
@login_required
def view_sop(sop_id):
    sop = SOPDocument.query.get_or_404(sop_id)
    sections = sop.get_sections_data()

    return render_template('view_sop.html', sop=sop, sections=sections)

@app.route('/sop/<int:sop_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_sop(sop_id):
    sop = SOPDocument.query.get_or_404(sop_id)

    if not current_user.has_permission('edit') and sop.author_id != current_user.id:
        flash('Insufficient permissions to edit this SOP', 'error')
        return redirect(url_for('main_dashboard'))

    if request.method == 'POST':
        sop.procedure_title = request.form.get('title')
        sop.laboratory_department = request.form.get('department')

        sections_data = {}
        for section_key in SOPDocument.get_default_sections().keys():
            sections_data[section_key] = request.form.get(section_key, '')

        sop.save_sections_data(sections_data)
        sop.modification_timestamp = datetime.utcnow()

        database.session.commit()
        flash('SOP updated successfully', 'success')
        return redirect(url_for('view_sop', sop_id=sop.id))

    return render_template('edit_sop.html', sop=sop, sections=sop.get_sections_data())

@app.route('/sop/import', methods=['GET', 'POST'])
@login_required
def import_sop():
    if not current_user.has_permission('create'):
        flash('Insufficient permissions to import SOPs', 'error')
        return redirect(url_for('main_dashboard'))

    if request.method == 'POST':
        try:
            # Check if single file upload
            if 'document' in request.files:
                file = request.files['document']
                department = request.form.get('department')

                if file and department:
                    # Save uploaded file temporarily
                    from werkzeug.utils import secure_filename
                    filename = secure_filename(file.filename)
                    upload_path = Path('uploads')
                    upload_path.mkdir(exist_ok=True)
                    file_path = upload_path / filename
                    file.save(str(file_path))

                    # Import document using document_importer module
                    try:
                        from document_importer import SOPImportManager
                        import_manager = SOPImportManager(database)
                        result = import_manager.import_to_sop(
                            str(file_path),
                            current_user.id,
                            department
                        )

                        if result['success']:
                            flash(f'Successfully imported SOP: {result["document_code"]}', 'success')
                            return redirect(url_for('view_sop', sop_id=result['sop_id']))
                        else:
                            flash(f'Import failed: {result.get("error", "Unknown error")}', 'error')

                    except ImportError:
                        # If document_importer not available, use basic import
                        doc_code = SOPManager.generate_document_code(department, 'imported')

                        new_sop = SOPDocument(
                            document_identifier=doc_code,
                            procedure_title=request.form.get('sop_title', filename),
                            laboratory_department=department,
                            author_id=current_user.id,
                            review_due_date=datetime.utcnow() + timedelta(days=365)
                        )

                        # Read file content
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()

                        sections = SOPDocument.get_default_sections()
                        sections['purpose'] = f'Imported from: {filename}\n\n{content[:500]}'
                        new_sop.save_sections_data(sections)

                        database.session.add(new_sop)
                        database.session.commit()

                        flash(f'SOP {doc_code} imported (basic mode)', 'success')
                        return redirect(url_for('edit_sop', sop_id=new_sop.id))

                    finally:
                        # Clean up temporary file
                        if file_path.exists():
                            file_path.unlink()

            # Check if batch import
            elif 'folder_path' in request.form:
                folder_path = request.form.get('folder_path')
                department = request.form.get('batch_department')

                if folder_path and department:
                    try:
                        from document_importer import SOPImportManager
                        import_manager = SOPImportManager(database)
                        result = import_manager.batch_import(
                            folder_path,
                            current_user.id,
                            department
                        )

                        flash(f'Batch import: {result["successful"]} successful, {result["failed"]} failed', 'info')
                        return redirect(url_for('main_dashboard'))

                    except Exception as e:
                        flash(f'Batch import failed: {str(e)}', 'error')

        except Exception as e:
            flash(f'Import error: {str(e)}', 'error')

    return render_template('import_sop.html')

# Template Filters
@app.template_filter('format_datetime')
def format_datetime(value):
    if value:
        return value.strftime('%Y-%m-%d %H:%M')
    return 'Not set'

# Database Initialization
def initialize_database():
    with app.app_context():
        database.create_all()

        admin_user = KPUser.query.filter_by(employee_id='ADMIN001').first()
        if not admin_user:
            admin = KPUser(
                employee_id='ADMIN001',
                full_name='System Administrator',
                email_address='admin@kp.org',
                position_title='Laboratory Manager',
                department_name='ADMINISTRATION',
                access_level='admin'
            )
            admin.create_password('admin123')
            database.session.add(admin)

            # Create sample users
            tech1 = KPUser(
                employee_id='TECH001',
                full_name='John Smith',
                email_address='jsmith@kp.org',
                position_title='Medical Laboratory Scientist',
                department_name='HEMATOLOGY',
                access_level='supervisor'
            )
            tech1.create_password('tech123')
            database.session.add(tech1)

            tech2 = KPUser(
                employee_id='TECH002',
                full_name='Sarah Johnson',
                email_address='sjohnson@kp.org',
                position_title='Medical Laboratory Technician',
                department_name='CHEMISTRY',
                access_level='staff'
            )
            tech2.create_password('tech123')
            database.session.add(tech2)

            database.session.commit()
            print("✅ Sample users created!")
            print("   Admin: ADMIN001 / admin123")
            print("   Tech1: TECH001 / tech123 (Supervisor)")
            print("   Tech2: TECH002 / tech123 (Staff)")

if __name__ == '__main__':
    initialize_database()
    print("\n🚀 Starting Kaiser Permanente SOP Management System...")
    print("📱 Access at: http://localhost:5002")
    app.run(debug=True, host='127.0.0.1', port=5002)

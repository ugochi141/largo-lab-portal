#!/usr/bin/env python3
"""
Quick Setup Script for Kaiser Permanente SOP Management System
This script will create all necessary files and start the application
"""

import os
import subprocess
import sys

def create_file(filepath, content):
    """Create a file with the given content"""
    dir_path = os.path.dirname(filepath)
    if dir_path:
        os.makedirs(dir_path, exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"✅ Created: {filepath}")

def main():
    print("🏥 Kaiser Permanente SOP Management System")
    print("=" * 50)

    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ required. Please upgrade Python.")
        return

    print("📦 Installing required packages...")

    # Install packages
    packages = [
        "flask==2.3.3",
        "flask-sqlalchemy==3.0.5",
        "flask-login==0.6.3",
        "werkzeug==2.3.7"
    ]

    for package in packages:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✅ Installed: {package}")
        except subprocess.CalledProcessError:
            print(f"⚠️ Failed to install: {package}")

    # Create requirements.txt
    requirements_content = """flask==2.3.3
flask-sqlalchemy==3.0.5
flask-login==0.6.3
werkzeug==2.3.7
python-dateutil==2.8.2"""
    create_file("requirements.txt", requirements_content)

    # Create the main application file
    app_content = '''"""
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
        return {
            'purpose': '',
            'clinical_significance': '',
            'scope': '',
            'responsibilities': '',
            'safety_requirements': '',
            'specimen_requirements': '',
            'reagents_supplies': '',
            'equipment': '',
            'maintenance': '',
            'quality_control': '',
            'calibration': '',
            'troubleshooting': '',
            'test_procedure': '',
            'calculations_reporting': '',
            'reference_ranges': '',
            'critical_values': '',
            'limitations_interferences': '',
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
    print("\\n🚀 Starting Kaiser Permanente SOP Management System...")
    print("📱 Access at: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
'''

    create_file("app.py", app_content)

    # Create base template
    base_template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Kaiser Permanente SOP System{% endblock %}</title>
    <style>
        :root {
            --kp-blue: #0066cc;
            --kp-light-blue: #e8f4f8;
            --kp-dark-blue: #004499;
            --success-green: #28a745;
            --warning-yellow: #ffc107;
            --danger-red: #dc3545;
            --gray-light: #f8f9fa;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: var(--gray-light);
            color: #333;
            line-height: 1.6;
        }

        .header {
            background: linear-gradient(135deg, var(--kp-blue), var(--kp-dark-blue));
            color: white;
            padding: 1rem 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header h1 {
            font-size: 1.8rem;
            font-weight: 300;
        }

        .nav-bar {
            background: white;
            padding: 0.5rem 2rem;
            border-bottom: 1px solid #ddd;
        }

        .nav-bar ul {
            list-style: none;
            display: flex;
            gap: 2rem;
        }

        .nav-bar a {
            text-decoration: none;
            color: var(--kp-blue);
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background 0.3s;
        }

        .nav-bar a:hover {
            background: var(--kp-light-blue);
        }

        .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 2rem;
        }

        .alert {
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 4px;
            border-left: 4px solid;
        }

        .alert-success {
            background: #d4edda;
            border-color: var(--success-green);
            color: #155724;
        }

        .alert-error {
            background: #f8d7da;
            border-color: var(--danger-red);
            color: #721c24;
        }

        .alert-info {
            background: #d1ecf1;
            border-color: #17a2b8;
            color: #0c5460;
        }

        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: var(--kp-blue);
            color: white;
            text-decoration: none;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s;
        }

        .btn:hover {
            background: var(--kp-dark-blue);
        }

        .btn-success {
            background: var(--success-green);
        }

        .btn-warning {
            background: var(--warning-yellow);
            color: #333;
        }

        .btn-danger {
            background: var(--danger-red);
        }

        .card {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin: 1rem 0;
        }

        .form-group {
            margin: 1rem 0;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }

        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background: var(--kp-blue);
            color: white;
            font-weight: 500;
        }

        tr:hover {
            background: var(--gray-light);
        }

        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .status-active {
            background: #d4edda;
            color: #155724;
        }

        .status-draft {
            background: #fff3cd;
            color: #856404;
        }

        .status-review {
            background: #d1ecf1;
            color: #0c5460;
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>🏥 Kaiser Permanente Largo Laboratory - SOP Management System</h1>
        {% if current_user.is_authenticated %}
        <p>Welcome, {{ current_user.full_name }} | {{ current_user.department_name }} | {{ current_user.position_title }}</p>
        {% endif %}
    </header>

    {% if current_user.is_authenticated %}
    <nav class="nav-bar">
        <ul>
            <li><a href="{{ url_for('main_dashboard') }}">📊 Dashboard</a></li>
            <li><a href="{{ url_for('create_sop') }}">📝 Create SOP</a></li>
            <li><a href="{{ url_for('user_logout') }}">🚪 Logout</a></li>
        </ul>
    </nav>
    {% endif %}

    <main class="container">
        {% with messages = get_flashed_messages(with_categories=true) %}
        {% if messages %}
        {% for category, message in messages %}
        <div class="alert alert-{{ category }}">{{ message }}</div>
        {% endfor %}
        {% endif %}
        {% endwith %}

        {% block content %}{% endblock %}
    </main>
</body>
</html>'''

    create_file("templates/base.html", base_template)

    # Create authentication template
    auth_template = '''{% extends "base.html" %}

{% block title %}Login - Kaiser Permanente SOP System{% endblock %}

{% block content %}
<div class="card" style="max-width: 500px; margin: 4rem auto;">
    <h2 style="text-align: center; margin-bottom: 2rem; color: var(--kp-blue);">
        🔐 System Authentication
    </h2>

    <form method="POST">
        <div class="form-group">
            <label for="employee_id">Employee ID:</label>
            <input type="text" id="employee_id" name="employee_id" required
                   placeholder="Enter your Kaiser Permanente Employee ID">
        </div>

        <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required
                   placeholder="Enter your password">
        </div>

        <div class="form-group">
            <button type="submit" class="btn" style="width: 100%;">
                🚀 Access SOP System
            </button>
        </div>
    </form>

    <div style="text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ddd;">
        <small>
            <strong>Test Accounts:</strong><br>
            Admin: ADMIN001 / admin123<br>
            Supervisor: TECH001 / tech123<br>
            Staff: TECH002 / tech123
        </small>
    </div>
</div>
{% endblock %}'''

    create_file("templates/authentication.html", auth_template)

    # Create dashboard template
    dashboard_template = '''{% extends "base.html" %}

{% block title %}Dashboard - Kaiser Permanente SOP System{% endblock %}

{% block content %}
<h2 style="color: var(--kp-blue); margin-bottom: 2rem;">📊 SOP Management Dashboard</h2>

<!-- Statistics Cards -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
    <div class="card" style="text-align: center; background: linear-gradient(135deg, var(--kp-blue), var(--kp-dark-blue)); color: white;">
        <h3>📚 Total SOPs</h3>
        <p style="font-size: 2rem; font-weight: bold;">{{ data.statistics.total }}</p>
    </div>

    <div class="card" style="text-align: center; background: linear-gradient(135deg, var(--success-green), #1e7e34); color: white;">
        <h3>✅ Active SOPs</h3>
        <p style="font-size: 2rem; font-weight: bold;">{{ data.statistics.active }}</p>
    </div>

    <div class="card" style="text-align: center; background: linear-gradient(135deg, var(--warning-yellow), #e0a800); color: white;">
        <h3>📝 Draft SOPs</h3>
        <p style="font-size: 2rem; font-weight: bold;">{{ data.statistics.draft }}</p>
    </div>

    <div class="card" style="text-align: center; background: linear-gradient(135deg, #17a2b8, #138496); color: white;">
        <h3>🔄 Under Review</h3>
        <p style="font-size: 2rem; font-weight: bold;">{{ data.statistics.review }}</p>
    </div>
</div>

<!-- Quick Actions -->
<div class="card">
    <h3 style="color: var(--kp-blue); margin-bottom: 1rem;">🚀 Quick Actions</h3>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="{{ url_for('create_sop') }}" class="btn">📝 Create New SOP</a>
        <button class="btn btn-warning" onclick="alert('Feature coming soon!')">📊 Generate Report</button>
    </div>
</div>

<!-- Recent Updates -->
<div class="card">
    <h3 style="color: var(--kp-blue); margin-bottom: 1rem;">📈 Recent SOP Updates</h3>

    {% if data.recent_updates %}
    <table>
        <thead>
            <tr>
                <th>Document Code</th>
                <th>Title</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {% for sop in data.recent_updates %}
            <tr>
                <td><strong>{{ sop.document_identifier }}</strong></td>
                <td>{{ sop.procedure_title }}</td>
                <td>{{ sop.laboratory_department }}</td>
                <td>
                    <span class="status-badge status-{{ sop.document_status }}">
                        {{ sop.document_status.title() }}
                    </span>
                </td>
                <td>{{ sop.modification_timestamp | format_datetime }}</td>
                <td>
                    <a href="{{ url_for('view_sop', sop_id=sop.id) }}" class="btn" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">👁️ View</a>
                    {% if current_user.has_permission('edit') or sop.author_id == current_user.id %}
                    <a href="{{ url_for('edit_sop', sop_id=sop.id) }}" class="btn btn-warning" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">✏️ Edit</a>
                    {% endif %}
                </td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
    {% else %}
    <p style="text-align: center; color: #666; padding: 2rem;">
        No SOPs found. <a href="{{ url_for('create_sop') }}" class="btn" style="padding: 0.5rem 1rem;">Create your first SOP</a>
    </p>
    {% endif %}
</div>
{% endblock %}'''

    create_file("templates/dashboard.html", dashboard_template)

    # Create SOP creation template
    create_template = '''{% extends "base.html" %}

{% block title %}Create SOP - Kaiser Permanente SOP System{% endblock %}

{% block content %}
<h2 style="color: var(--kp-blue); margin-bottom: 2rem;">📝 Create New Standard Operating Procedure</h2>

<div class="card">
    <form method="POST">
        <div class="form-group">
            <label for="title">Procedure Title:</label>
            <input type="text" id="title" name="title" required
                   placeholder="Enter descriptive procedure title">
        </div>

        <div class="form-group">
            <label for="department">Laboratory Department:</label>
            <select id="department" name="department" required>
                <option value="">Select Department</option>
                {% for dept in departments %}
                <option value="{{ dept }}">{{ dept }}</option>
                {% endfor %}
            </select>
        </div>

        <div style="background: var(--kp-light-blue); padding: 1rem; border-radius: 4px; margin: 1rem 0;">
            <h4 style="color: var(--kp-dark-blue);">📋 What happens next:</h4>
            <ol style="margin-left: 1rem;">
                <li>Document code will be automatically generated</li>
                <li>Default sections will be created following Kaiser Permanente standards</li>
                <li>You'll be redirected to the editor to complete the SOP</li>
                <li>All 23 required sections must be completed for approval</li>
            </ol>
        </div>

        <div class="form-group">
            <button type="submit" class="btn">🚀 Create SOP Template</button>
            <a href="{{ url_for('main_dashboard') }}" class="btn" style="background: #6c757d; margin-left: 1rem;">Cancel</a>
        </div>
    </form>
</div>
{% endblock %}'''

    create_file("templates/create_sop.html", create_template)

    # Create basic SOP edit template
    edit_template = '''{% extends "base.html" %}

{% block title %}Edit SOP - Kaiser Permanente SOP System{% endblock %}

{% block content %}
<h2 style="color: var(--kp-blue); margin-bottom: 2rem;">✏️ Edit SOP: {{ sop.document_identifier }}</h2>

<div class="card">
    <form method="POST">
        <div class="form-group">
            <label for="title">Procedure Title:</label>
            <input type="text" id="title" name="title" value="{{ sop.procedure_title }}" required>
        </div>

        <div class="form-group">
            <label for="department">Department:</label>
            <input type="text" id="department" name="department" value="{{ sop.laboratory_department }}" required>
        </div>

        <h3 style="color: var(--kp-blue); margin: 2rem 0 1rem 0;">📋 SOP Sections</h3>

        {% for section_key, section_value in sections.items() %}
        <div class="form-group">
            <label for="{{ section_key }}">{{ section_key.replace('_', ' ').title() }}:</label>
            <textarea id="{{ section_key }}" name="{{ section_key }}" rows="4">{{ section_value }}</textarea>
        </div>
        {% endfor %}

        <div class="form-group">
            <button type="submit" class="btn">💾 Save SOP</button>
            <a href="{{ url_for('view_sop', sop_id=sop.id) }}" class="btn" style="background: #6c757d; margin-left: 1rem;">Cancel</a>
        </div>
    </form>
</div>
{% endblock %}'''

    create_file("templates/edit_sop.html", edit_template)

    # Create basic view SOP template
    view_template = '''{% extends "base.html" %}

{% block title %}{{ sop.procedure_title }} - Kaiser Permanente SOP System{% endblock %}

{% block content %}
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
    <h2 style="color: var(--kp-blue);">{{ sop.document_identifier }}: {{ sop.procedure_title }}</h2>
    <div>
        {% if current_user.has_permission('edit') or sop.author_id == current_user.id %}
        <a href="{{ url_for('edit_sop', sop_id=sop.id) }}" class="btn btn-warning">✏️ Edit</a>
        {% endif %}
        <a href="{{ url_for('main_dashboard') }}" class="btn">🔙 Back to Dashboard</a>
    </div>
</div>

<div class="card">
    <div style="background: var(--kp-light-blue); padding: 1rem; border-radius: 4px; margin-bottom: 2rem;">
        <h3>📋 Document Information</h3>
        <p><strong>Document Code:</strong> {{ sop.document_identifier }}</p>
        <p><strong>Department:</strong> {{ sop.laboratory_department }}</p>
        <p><strong>Version:</strong> {{ sop.version_number }}</p>
        <p><strong>Status:</strong> <span class="status-badge status-{{ sop.document_status }}">{{ sop.document_status.title() }}</span></p>
        <p><strong>Author:</strong> {{ sop.document_author.full_name }}</p>
        <p><strong>Last Updated:</strong> {{ sop.modification_timestamp | format_datetime }}</p>
    </div>

    {% for section_key, section_value in sections.items() %}
    <div style="margin: 2rem 0;">
        <h3 style="color: var(--kp-dark-blue); border-bottom: 2px solid var(--kp-blue); padding-bottom: 0.5rem;">
            {{ section_key.replace('_', ' ').title() }}
        </h3>
        {% if section_value %}
        <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 4px;">
            {{ section_value | replace('\n', '<br>') | safe }}
        </div>
        {% else %}
        <p style="color: #666; font-style: italic; margin-top: 1rem;">This section has not been completed yet.</p>
        {% endif %}
    </div>
    {% endfor %}
</div>
{% endblock %}'''

    create_file("templates/view_sop.html", view_template)

    print("\n📁 All files created successfully!")
    print("\n🚀 To run the application:")
    print("1. cd to the directory where you saved this script")
    print("2. Run: python quick_setup.py")
    print("3. Open browser to: http://localhost:5000")
    print("\n🔐 Login with:")
    print("   Admin: ADMIN001 / admin123")
    print("   Supervisor: TECH001 / tech123")
    print("   Staff: TECH002 / tech123")

if __name__ == '__main__':
    main()
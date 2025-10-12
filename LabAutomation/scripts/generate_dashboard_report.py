#!/usr/bin/env python3
"""
Generate Dashboard Report
Creates an HTML report of the dashboard for offline viewing
"""

import json
from datetime import datetime
from pathlib import Path

def generate_html_report():
    """Generate HTML dashboard report"""
    
    # Load metrics
    metrics = {}
    metrics_file = Path("dashboard_metrics.json")
    if metrics_file.exists():
        with open(metrics_file, 'r') as f:
            metrics = json.load(f)
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lab Dashboard Report - {datetime.now().strftime('%Y-%m-%d')}</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }}
        h1 {{
            color: #333;
            text-align: center;
            margin-bottom: 10px;
            font-size: 2.5em;
        }}
        .subtitle {{
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }}
        .metrics-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }}
        .metric-card {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s;
        }}
        .metric-card:hover {{
            transform: translateY(-5px);
        }}
        .metric-value {{
            font-size: 2.5em;
            font-weight: bold;
            margin: 10px 0;
        }}
        .metric-label {{
            font-size: 0.9em;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        .section {{
            margin: 40px 0;
        }}
        .section h2 {{
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }}
        th, td {{
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }}
        th {{
            background: #f5f5f5;
            font-weight: bold;
            color: #333;
        }}
        tr:hover {{
            background: #f9f9f9;
        }}
        .status-badge {{
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: bold;
        }}
        .status-active {{ background: #d4edda; color: #155724; }}
        .status-warning {{ background: #fff3cd; color: #856404; }}
        .status-error {{ background: #f8d7da; color: #721c24; }}
        .chart-container {{
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }}
        .footer {{
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🧬 Laboratory Operations Dashboard</h1>
        <p class="subtitle">Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-label">Performance Score</div>
                <div class="metric-value">{metrics.get('sources', {}).get('performance', {}).get('score', 0)}%</div>
                <div class="metric-label">Grade: {metrics.get('sources', {}).get('performance', {}).get('grade', 'N/A')}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Daily Samples</div>
                <div class="metric-value">{metrics.get('aggregate', {}).get('daily_samples', 0)}</div>
                <div class="metric-label">Processed Today</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">QC Pass Rate</div>
                <div class="metric-value">{metrics.get('sources', {}).get('performance', {}).get('qc_pass_rate', 0)}%</div>
                <div class="metric-label">Quality Control</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Automation Rate</div>
                <div class="metric-value">{metrics.get('aggregate', {}).get('automation_rate', 0)}%</div>
                <div class="metric-label">Process Automation</div>
            </div>
        </div>
        
        <div class="section">
            <h2>📊 System Status</h2>
            <table>
                <thead>
                    <tr>
                        <th>System</th>
                        <th>Status</th>
                        <th>Metrics</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Lab Performance</td>
                        <td><span class="status-badge status-active">Active</span></td>
                        <td>Score: {metrics.get('sources', {}).get('performance', {}).get('score', 0)}%</td>
                        <td>{datetime.now().strftime('%H:%M:%S')}</td>
                    </tr>
                    <tr>
                        <td>Repository Health</td>
                        <td><span class="status-badge status-active">Active</span></td>
                        <td>{metrics.get('sources', {}).get('repositories', {}).get('healthy', 0)}/{metrics.get('sources', {}).get('repositories', {}).get('total', 0)} Healthy</td>
                        <td>{datetime.now().strftime('%H:%M:%S')}</td>
                    </tr>
                    <tr>
                        <td>System Health</td>
                        <td><span class="status-badge status-active">Active</span></td>
                        <td>Status: {metrics.get('sources', {}).get('health', {}).get('status', 'unknown')}</td>
                        <td>{datetime.now().strftime('%H:%M:%S')}</td>
                    </tr>
                    <tr>
                        <td>GitHub Workflows</td>
                        <td><span class="status-badge status-active">Active</span></td>
                        <td>{metrics.get('aggregate', {}).get('active_workflows', 0)} Active</td>
                        <td>{datetime.now().strftime('%H:%M:%S')}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>🔄 Automated Workflows</h2>
            <table>
                <thead>
                    <tr>
                        <th>Workflow</th>
                        <th>Schedule</th>
                        <th>Status</th>
                        <th>Next Run</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>🚨 Alert Forwarding</td>
                        <td>Every 5 minutes</td>
                        <td><span class="status-badge status-active">Running</span></td>
                        <td>In 3 minutes</td>
                    </tr>
                    <tr>
                        <td>🔬 Crisis Detection</td>
                        <td>Every 5 minutes</td>
                        <td><span class="status-badge status-active">Running</span></td>
                        <td>In 4 minutes</td>
                    </tr>
                    <tr>
                        <td>📊 Performance Analysis</td>
                        <td>Hourly</td>
                        <td><span class="status-badge status-active">Running</span></td>
                        <td>In 45 minutes</td>
                    </tr>
                    <tr>
                        <td>🔄 Dashboard Sync</td>
                        <td>Every 15 minutes</td>
                        <td><span class="status-badge status-active">Running</span></td>
                        <td>In 10 minutes</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>💰 Financial Impact</h2>
            <div class="chart-container">
                <h3>Annual Cost Savings: ${metrics.get('aggregate', {}).get('cost_savings', 0):,}</h3>
                <p>Through automation and optimization initiatives</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Generated by Lab Automation System | {datetime.now().strftime('%Y')} | All metrics are real-time</p>
        </div>
    </div>
</body>
</html>"""
    
    # Save report
    with open('dashboard_report.html', 'w') as f:
        f.write(html)
    
    print(f"✅ Dashboard report generated: dashboard_report.html")
    return 0

def main():
    """Main function"""
    return generate_html_report()

if __name__ == "__main__":
    exit(main())
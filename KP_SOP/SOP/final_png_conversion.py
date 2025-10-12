import base64
import os
from datetime import datetime

def image_to_base64(image_path):
    """Convert image file to base64 string"""
    try:
        with open(image_path, 'rb') as image_file:
            base64_string = base64.b64encode(image_file.read()).decode('utf-8')
            # Determine image format from file extension
            ext = os.path.splitext(image_path)[1].lower()
            if ext in ['.jpg', '.jpeg']:
                mime_type = 'image/jpeg'
            elif ext == '.png':
                mime_type = 'image/png'
            else:
                mime_type = 'image/jpeg'  # default
            return f"data:{mime_type};base64,{base64_string}"
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return None

# Correct paths - PNG files are in main IMG directory, others in "Needs to be SOP"
main_img_path = "/Users/ugochi141/Desktop/KP SOP/HEME/URINES/IMG"
sop_path = "/Users/ugochi141/Desktop/KP SOP/HEME/URINES/IMG/Needs to be SOP"

image_paths = {
    # Screenshots (PNG) - in main IMG directory
    'control_panel': os.path.join(main_img_path, 'Screenshot 2025-07-22 at 6.31.19 PM.png'),
    'color_guide': os.path.join(main_img_path, 'Screenshot 2025-07-30 at 8.28.20 PM.png'),
    'sg_clean': os.path.join(main_img_path, 'Screenshot 2025-07-22 at 5.18.09 PM.png'),
    'waste_opening': os.path.join(main_img_path, 'Screenshot 2025-07-22 at 6.30.15 PM.png'),
    
    # Other images (JPG/JPEG) - in "Needs to be SOP" subfolder
    'novus_uf': os.path.join(sop_path, 'NovusandUF.jpg'),
    'cassette_handling': os.path.join(sop_path, 'novus-cassette-16x9_1800000000882813.jpg'),
    'manual_full': os.path.join(sop_path, 'urine micrscope analysis full.jpg'),
    'manual_analysis': os.path.join(sop_path, 'urine micrscope analysis.jpg'),
    'manual_analysis2': os.path.join(sop_path, 'urine micrscope analysis2.jpg'),
    'microscopic_analysis': os.path.join(sop_path, 'DBDED27B-5D73-4606-8883-4DBBD4618EA7.jpeg'),
    'microscope_findings': os.path.join(sop_path, 'urine microscope findings.jpg'),
    'crystals_analysis': os.path.join(sop_path, 'urine micrscope analysis crystals.jpg'),
    'urine_crystals': os.path.join(sop_path, 'urine crstals.jpg'),
    'urine_casts': os.path.join(sop_path, 'Urine cast .jpg'),
    'extra_tube': os.path.join(sop_path, 'Extra Tube.jpeg')
}

# Convert all images to base64
base64_images = {}
print("Converting ALL images to base64 (PNG + JPG):")
print("=" * 50)

for key, path in image_paths.items():
    file_name = os.path.basename(path)
    file_type = os.path.splitext(path)[1].upper()
    print(f"Processing {key}: {file_name} ({file_type})")
    
    base64_data = image_to_base64(path)
    if base64_data:
        base64_images[key] = base64_data
        print(f"   ✓ Successfully converted {key}")
    else:
        print(f"   ✗ Failed to convert {key}")
        base64_images[key] = ""
    print()

print("=" * 50)
print(f"📊 CONVERSION SUMMARY:")
print(f"✅ Successfully processed: {len([k for k, v in base64_images.items() if v])}")
print(f"❌ Failed conversions: {len([k for k, v in base64_images.items() if not v])}")

if len([k for k, v in base64_images.items() if not v]) > 0:
    print("\n❌ Failed files:")
    for k, v in base64_images.items():
        if not v:
            print(f"   - {k}")

# Create the complete HTML content with ALL images embedded
html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Largo Laboratory - Urinalysis Procedure</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }}
        .container {{
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        h1 {{
            color: #1a472a;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            border-bottom: 3px solid #2d5016;
            padding-bottom: 15px;
        }}
        h2 {{
            color: #1a472a;
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 1.8em;
            border-bottom: 2px solid #4a7c16;
            padding-bottom: 10px;
        }}
        h3 {{
            color: #2d5016;
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 1.4em;
        }}
        h4 {{
            color: #3a5f1f;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 1.2em;
        }}
        .header-info {{
            background-color: #f0f4ec;
            border: 2px solid #4a7c16;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }}
        .warning {{
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }}
        .note {{
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }}
        .critical {{
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }}
        th, td {{
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }}
        th {{
            background-color: #4a7c16;
            color: white;
            font-weight: bold;
        }}
        tr:nth-child(even) {{
            background-color: #f2f2f2;
        }}
        ul, ol {{
            margin-left: 20px;
            margin-bottom: 15px;
        }}
        li {{
            margin-bottom: 5px;
        }}
        .image-container {{
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #dee2e6;
        }}
        .image-container img {{
            max-width: 100%;
            height: auto;
            border-radius: 5px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }}
        .image-caption {{
            font-style: italic;
            color: #666;
            margin-top: 10px;
            font-size: 0.9em;
        }}
        .procedure-box {{
            background-color: #f8f9fa;
            border-left: 4px solid #4a7c16;
            padding: 15px;
            margin: 20px 0;
        }}
        .qc-table {{
            background-color: #f0f4ec;
        }}
        .footer {{
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            color: #666;
        }}
        @media print {{
            body {{
                background-color: white;
            }}
            .container {{
                box-shadow: none;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>LARGO LABORATORY - URINALYSIS PROCEDURE</h1>
        
        <div class="header-info">
            <table style="border: none; box-shadow: none;">
                <tr>
                    <td style="border: none;"><strong>Document Version:</strong></td>
                    <td style="border: none;">3.0</td>
                    <td style="border: none;"><strong>Department:</strong></td>
                    <td style="border: none;">Largo Clinical Laboratory</td>
                </tr>
                <tr>
                    <td style="border: none;"><strong>Effective Date:</strong></td>
                    <td style="border: none;">{datetime.now().strftime('%B %d, %Y')}</td>
                    <td style="border: none;"><strong>Review Date:</strong></td>
                    <td style="border: none;">Annual</td>
                </tr>
                <tr>
                    <td style="border: none;"><strong>Equipment:</strong></td>
                    <td style="border: none;">CLINITEK Novus Analyzer</td>
                    <td style="border: none;"><strong>Approved By:</strong></td>
                    <td style="border: none;">Laboratory Director</td>
                </tr>
            </table>
        </div>

        <h2>TABLE OF CONTENTS</h2>
        <ol>
            <li><a href="#purpose">Purpose</a></li>
            <li><a href="#scope">Scope</a></li>
            <li><a href="#responsibilities">Responsibilities</a></li>
            <li><a href="#equipment">Equipment and Supplies</a></li>
            <li><a href="#specimen">Specimen Requirements</a></li>
            <li><a href="#calibration">Calibration Procedures</a></li>
            <li><a href="#qc">Quality Control</a></li>
            <li><a href="#procedure">Test Procedure</a></li>
            <li><a href="#manual-dipstick">Manual Dipstick Analysis</a></li>
            <li><a href="#results">Result Interpretation</a></li>
            <li><a href="#maintenance">Maintenance</a></li>
            <li><a href="#troubleshooting">Troubleshooting</a></li>
            <li><a href="#extra-tube">Extra Tube Procedure</a></li>
            <li><a href="#references">References</a></li>
        </ol>

        <h2 id="purpose">1. PURPOSE</h2>
        <p>This document provides comprehensive procedures for performing urinalysis testing at the Largo Laboratory using the CLINITEK Novus automated urine chemistry analyzer as the primary testing method, with manual backup procedures when necessary.</p>

        <h2 id="scope">2. SCOPE</h2>
        <p>This procedure applies to all clinical laboratory personnel authorized to perform urinalysis testing at the Largo Laboratory. It covers:</p>
        <ul>
            <li>Automated urinalysis using CLINITEK Novus</li>
            <li>Manual dipstick procedures (backup method)</li>
            <li>Microscopic examination</li>
            <li>Quality control and maintenance</li>
            <li>Result reporting and interpretation</li>
        </ul>

        <h2 id="responsibilities">3. RESPONSIBILITIES</h2>
        <h3>3.1 Laboratory Director</h3>
        <ul>
            <li>Approve and review procedures annually</li>
            <li>Ensure compliance with regulatory requirements</li>
            <li>Authorize personnel competency</li>
        </ul>
        
        <h3>3.2 Laboratory Supervisor</h3>
        <ul>
            <li>Implement and maintain procedures</li>
            <li>Train and assess personnel</li>
            <li>Monitor quality control and proficiency testing</li>
            <li>Investigate and document non-conformances</li>
        </ul>
        
        <h3>3.3 Medical Technologists/Technicians</h3>
        <ul>
            <li>Follow established procedures</li>
            <li>Perform daily quality control</li>
            <li>Maintain equipment logs</li>
            <li>Report issues to supervisor</li>
        </ul>

        <h2 id="equipment">4. EQUIPMENT AND SUPPLIES</h2>
        <h3>4.1 Primary Equipment</h3>
        <div class="procedure-box">
            <h4>CLINITEK Novus Urine Chemistry Analyzer</h4>
            <ul>
                <li>Model: CLINITEK Novus</li>
                <li>Manufacturer: Siemens Healthineers</li>
                <li>Serial Number: [Specific to instrument]</li>
                <li>Installation Date: [Specific to lab]</li>
            </ul>
        </div>

        <h3>4.2 Reagents and Supplies</h3>
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Catalog Number</th>
                    <th>Storage</th>
                    <th>Stability</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Multistix 10 SG Reagent Strips</td>
                    <td>2300</td>
                    <td>Room temperature (15-30°C)</td>
                    <td>Until expiration date</td>
                </tr>
                <tr>
                    <td>CHEK-STIX Positive Control</td>
                    <td>2302</td>
                    <td>2-8°C</td>
                    <td>Until expiration date</td>
                </tr>
                <tr>
                    <td>CHEK-STIX Negative Control</td>
                    <td>2303</td>
                    <td>2-8°C</td>
                    <td>Until expiration date</td>
                </tr>
                <tr>
                    <td>Calibration Solution</td>
                    <td>2301</td>
                    <td>Room temperature</td>
                    <td>30 days after opening</td>
                </tr>
            </tbody>
        </table>

        <h3>4.3 Additional Equipment</h3>
        <ul>
            <li>Centrifuge (400g capability)</li>
            <li>Microscope with 10x, 40x, 100x objectives</li>
            <li>Refractometer for specific gravity backup</li>
            <li>Timer</li>
            <li>Microscope slides and coverslips</li>
            <li>Disposable transfer pipettes</li>
            <li>PPE (gloves, lab coat, safety glasses)</li>
        </ul>

        <h2 id="specimen">5. SPECIMEN REQUIREMENTS</h2>
        <h3>5.1 Acceptable Specimens</h3>
        <table>
            <thead>
                <tr>
                    <th>Specimen Type</th>
                    <th>Container</th>
                    <th>Minimum Volume</th>
                    <th>Special Instructions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Random Urine</td>
                    <td>Sterile container</td>
                    <td>12 mL</td>
                    <td>Most common specimen</td>
                </tr>
                <tr>
                    <td>First Morning</td>
                    <td>Sterile container</td>
                    <td>12 mL</td>
                    <td>Preferred for protein, cells</td>
                </tr>
                <tr>
                    <td>Clean Catch Midstream</td>
                    <td>Sterile container</td>
                    <td>12 mL</td>
                    <td>For culture correlation</td>
                </tr>
                <tr>
                    <td>Catheterized</td>
                    <td>Sterile container</td>
                    <td>12 mL</td>
                    <td>Note collection method</td>
                </tr>
                <tr>
                    <td>Pediatric</td>
                    <td>Pediatric bag/container</td>
                    <td>3 mL</td>
                    <td>May limit microscopic</td>
                </tr>
            </tbody>
        </table>

        <div class="image-container">
            <img src="{base64_images.get('color_guide', '')}" alt="Visual color assessment reference guide" />
            <div class="image-caption">Visual color assessment reference guide</div>
        </div>

        <h3>5.2 Specimen Stability</h3>
        <div class="note">
            <strong>Important:</strong> Test specimens as soon as possible after collection for optimal results.
        </div>
        <table>
            <thead>
                <tr>
                    <th>Storage Temperature</th>
                    <th>Chemical Analysis</th>
                    <th>Microscopic Analysis</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Room Temperature (20-25°C)</td>
                    <td>2 hours</td>
                    <td>1 hour</td>
                </tr>
                <tr>
                    <td>Refrigerated (2-8°C)</td>
                    <td>24 hours</td>
                    <td>4 hours</td>
                </tr>
            </tbody>
        </table>

        <h3>5.3 Specimen Rejection Criteria</h3>
        <ul>
            <li>Unlabeled or mislabeled specimens</li>
            <li>Specimens in non-sterile containers (except when approved)</li>
            <li>Insufficient volume (<3 mL)</li>
            <li>Specimens >24 hours old</li>
            <li>Visible fecal contamination</li>
            <li>Specimens with preservatives (unless specified)</li>
        </ul>

        <h2 id="calibration">6. CALIBRATION PROCEDURES</h2>
        <h3>6.1 CLINITEK Novus Calibration</h3>
        <div class="note">
            <strong>Frequency:</strong> Every 6 months or when indicated by QC failures
        </div>

        <h4>6.1.1 Calibration Preparation</h4>
        <ol>
            <li>Ensure analyzer is clean and at operating temperature</li>
            <li>Check calibration solution expiration date</li>
            <li>Allow calibration solution to reach room temperature</li>
            <li>Gather calibration strips and documentation forms</li>
        </ol>

        <div class="image-container">
            <img src="{base64_images.get('sg_clean', '')}" alt="SG Clean calibration procedure" />
            <div class="image-caption">SG Clean calibration procedure</div>
        </div>

        <h4>6.1.2 Calibration Procedure</h4>
        <div class="procedure-box">
            <ol>
                <li>Access Calibration Menu on CLINITEK Novus</li>
                <li>Select "Full Calibration" option</li>
                <li>When prompted, insert calibration strip</li>
                <li>Apply calibration solution as directed</li>
                <li>Place strip on analyzer tray</li>
                <li>Press START when ready</li>
                <li>Repeat for all 10 parameters</li>
                <li>Review and accept calibration values</li>
                <li>Print calibration report</li>
                <li>File report in calibration log</li>
            </ol>
        </div>

        <h2 id="qc">7. QUALITY CONTROL REQUIREMENTS</h2>
        <h3>7.1 Daily Quality Control</h3>
        <div class="critical">
            <strong>CRITICAL:</strong> QC must be performed and pass before any patient testing
        </div>

        <div class="image-container">
            <img src="{base64_images.get('novus_uf', '')}" alt="Automated urine analyzer - front view" />
            <div class="image-caption">Automated urine analyzer - front view</div>
        </div>

        <div class="image-container">
            <img src="{base64_images.get('control_panel', '')}" alt="Automated urine analyzer - control panel" />
            <div class="image-caption">Automated urine analyzer - control panel</div>
        </div>

        <h4>7.1.1 QC Procedure</h4>
        <ol>
            <li>Remove controls from refrigerator</li>
            <li>Allow to reach room temperature (15-20 minutes)</li>
            <li>Mix gently by inversion</li>
            <li>Perform testing as with patient samples</li>
            <li>Record results in QC log</li>
            <li>Verify results are within acceptable ranges</li>
            <li>Take corrective action if needed</li>
        </ol>

        <h4>7.1.2 QC Acceptable Ranges</h4>
        <table class="qc-table">
            <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Negative Control</th>
                    <th>Positive Control</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Glucose</td>
                    <td>Negative</td>
                    <td>250-500 mg/dL</td>
                </tr>
                <tr>
                    <td>Bilirubin</td>
                    <td>Negative</td>
                    <td>Small-Moderate</td>
                </tr>
                <tr>
                    <td>Ketone</td>
                    <td>Negative</td>
                    <td>Small-Moderate</td>
                </tr>
                <tr>
                    <td>Specific Gravity</td>
                    <td>1.000-1.010</td>
                    <td>1.020-1.030</td>
                </tr>
                <tr>
                    <td>Blood</td>
                    <td>Negative</td>
                    <td>Small-Moderate</td>
                </tr>
                <tr>
                    <td>pH</td>
                    <td>5.0-6.0</td>
                    <td>7.5-8.5</td>
                </tr>
                <tr>
                    <td>Protein</td>
                    <td>Negative-Trace</td>
                    <td>30-100 mg/dL</td>
                </tr>
                <tr>
                    <td>Urobilinogen</td>
                    <td>0.2-1.0 mg/dL</td>
                    <td>4.0-8.0 mg/dL</td>
                </tr>
                <tr>
                    <td>Nitrite</td>
                    <td>Negative</td>
                    <td>Positive</td>
                </tr>
                <tr>
                    <td>Leukocytes</td>
                    <td>Negative</td>
                    <td>Small-Large</td>
                </tr>
            </tbody>
        </table>

        <h4>7.3 Important Note for Opening/Closing Instrument Cover</h4>
        <div class="warning">
            <strong>CAUTION:</strong> Always follow proper procedures when opening/closing instrument cover
        </div>

        <div class="image-container">
            <img src="{base64_images.get('waste_opening', '')}" alt="Opening test strip waste container" />
            <div class="image-caption">Opening test strip waste container</div>
        </div>

        <h4>7.4 Cassette Loading and Unloading Procedures</h4>
        <div class="image-container">
            <img src="{base64_images.get('cassette_handling', '')}" alt="Proper handling of test cartridges" />
            <div class="image-caption">Proper handling of test cartridges</div>
        </div>

        <h2 id="procedure">8. TEST PROCEDURE</h2>
        <h3>8.1 CLINITEK Novus Operation</h3>
        
        <h4>8.1.1 Daily Startup</h4>
        <ol>
            <li>Turn on CLINITEK Novus (if not already on)</li>
            <li>Allow 5-minute warm-up period</li>
            <li>Check printer paper supply</li>
            <li>Verify date and time settings</li>
            <li>Clean test table with approved disinfectant</li>
            <li>Run daily QC (see Section 7.1)</li>
        </ol>

        <h4>8.1.2 Patient Testing - Automated Method</h4>
        <div class="procedure-box">
            <ol>
                <li><strong>Specimen Preparation</strong>
                    <ul>
                        <li>Mix specimen gently by inverting 8-10 times</li>
                        <li>Check for proper labeling</li>
                        <li>Note physical characteristics</li>
                    </ul>
                </li>
                <li><strong>Strip Preparation</strong>
                    <ul>
                        <li>Remove one strip from container</li>
                        <li>Immediately close container tightly</li>
                        <li>Check strip for discoloration or damage</li>
                    </ul>
                </li>
                <li><strong>Testing Process</strong>
                    <ul>
                        <li>Immerse strip completely in urine</li>
                        <li>Remove immediately</li>
                        <li>Tap edge on container rim to remove excess</li>
                        <li>Place on CLINITEK Novus test table within 2 seconds</li>
                    </ul>
                </li>
                <li><strong>Analyzer Operation</strong>
                    <ul>
                        <li>Enter or scan patient ID</li>
                        <li>Select "Urinalysis" test</li>
                        <li>Press START button</li>
                        <li>Analyzer automatically reads at proper times</li>
                    </ul>
                </li>
                <li><strong>Result Review</strong>
                    <ul>
                        <li>Review results on screen</li>
                        <li>Verify patient ID</li>
                        <li>Add microscopic codes if needed</li>
                        <li>Accept and print/transmit results</li>
                    </ul>
                </li>
            </ol>
        </div>

        <h2 id="manual-dipstick">9. MANUAL DIPSTICK ANALYSIS</h2>
        <div class="warning">
            <strong>Note:</strong> Use manual method only when CLINITEK Novus is unavailable
        </div>

        <div class="image-container">
            <img src="{base64_images.get('manual_full', '')}" alt="Manual Urinalysis - Complete Setup" />
            <div class="image-caption">Manual Urinalysis - Complete Setup</div>
        </div>

        <div class="image-container">
            <img src="{base64_images.get('manual_analysis', '')}" alt="Manual Urinalysis Analysis" />
            <div class="image-caption">Manual Urinalysis Analysis</div>
        </div>

        <div class="image-container">
            <img src="{base64_images.get('manual_analysis2', '')}" alt="Manual Urinalysis Analysis - Detail View" />
            <div class="image-caption">Manual Urinalysis Analysis - Detail View</div>
        </div>

        <h3>9.1 Manual Procedure</h3>
        <ol>
            <li>Follow steps 1-3 from automated method</li>
            <li>Start timer immediately after removing excess urine</li>
            <li>Hold strip horizontal to prevent reagent mixing</li>
            <li>Read each pad at specified time against color chart</li>
            <li>Record results immediately</li>
        </ol>

        <h3>9.2 Manual Reading Times</h3>
        <table>
            <thead>
                <tr>
                    <th>Test</th>
                    <th>Reading Time</th>
                    <th>Critical Timing?</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Glucose</td>
                    <td>30 seconds</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>Bilirubin</td>
                    <td>30 seconds</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>Ketone</td>
                    <td>40 seconds</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>Specific Gravity</td>
                    <td>45 seconds</td>
                    <td>No</td>
                </tr>
                <tr>
                    <td>Blood</td>
                    <td>60 seconds</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>pH</td>
                    <td>60 seconds</td>
                    <td>No</td>
                </tr>
                <tr>
                    <td>Protein</td>
                    <td>60 seconds</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>Urobilinogen</td>
                    <td>60 seconds</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>Nitrite</td>
                    <td>60 seconds</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>Leukocytes</td>
                    <td>120 seconds</td>
                    <td>Yes</td>
                </tr>
            </tbody>
        </table>

        <h3>9.3 Microscopic Examination</h3>
        <div class="note">
            <strong>Perform microscopic when:</strong>
            <ul>
                <li>Any positive chemical result</li>
                <li>Physician specifically requests</li>
                <li>Part of comprehensive metabolic panel</li>
                <li>Abnormal physical characteristics</li>
            </ul>
        </div>

        <div class="image-container">
            <img src="{base64_images.get('microscopic_analysis', '')}" alt="Microscopic Urinalysis Setup" />
            <div class="image-caption">Microscopic Urinalysis Setup</div>
        </div>

        <div class="image-container">
            <img src="{base64_images.get('microscope_findings', '')}" alt="Urine Microscope Findings" />
            <div class="image-caption">Urine Microscope Findings</div>
        </div>

        <h4>9.3.1 Specimen Preparation</h4>
        <ol>
            <li>Pour 10-12 mL urine into conical centrifuge tube</li>
            <li>Centrifuge at 400g (≈1500 rpm) for 5 minutes</li>
            <li>Remove tube carefully to avoid resuspending sediment</li>
            <li>Decant supernatant, leaving 0.5-1.0 mL</li>
            <li>Resuspend sediment by gentle tapping</li>
        </ol>

        <h4>9.3.2 Crystal Analysis</h4>
        <div class="image-container">
            <img src="{base64_images.get('crystals_analysis', '')}" alt="Urine Crystal Analysis" />
            <div class="image-caption">Urine Crystal Analysis</div>
        </div>

        <div class="image-container">
            <img src="{base64_images.get('urine_crystals', '')}" alt="Common Urine Crystals" />
            <div class="image-caption">Common Urine Crystals</div>
        </div>

        <h4>9.3.3 Cast Identification</h4>
        <div class="image-container">
            <img src="{base64_images.get('urine_casts', '')}" alt="Urine Casts" />
            <div class="image-caption">Urine Casts</div>
        </div>

        <h4>9.3.4 Reporting Guidelines</h4>
        <table>
            <thead>
                <tr>
                    <th>Element</th>
                    <th>Reporting Method</th>
                    <th>Normal Range</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>RBC</td>
                    <td># per HPF</td>
                    <td>0-2/HPF</td>
                </tr>
                <tr>
                    <td>WBC</td>
                    <td># per HPF</td>
                    <td>0-5/HPF</td>
                </tr>
                <tr>
                    <td>Squamous Epithelial</td>
                    <td>Few/Moderate/Many</td>
                    <td>Few</td>
                </tr>
                <tr>
                    <td>Non-squamous Epithelial</td>
                    <td># per HPF</td>
                    <td>0-2/HPF</td>
                </tr>
                <tr>
                    <td>Hyaline Casts</td>
                    <td># per LPF</td>
                    <td>0-2/LPF</td>
                </tr>
                <tr>
                    <td>Other Casts</td>
                    <td>Type and # per LPF</td>
                    <td>None</td>
                </tr>
                <tr>
                    <td>Crystals</td>
                    <td>Type and quantity</td>
                    <td>Variable</td>
                </tr>
                <tr>
                    <td>Bacteria</td>
                    <td>None/Few/Moderate/Many</td>
                    <td>None-Few</td>
                </tr>
                <tr>
                    <td>Yeast</td>
                    <td>None/Few/Moderate/Many</td>
                    <td>None</td>
                </tr>
            </tbody>
        </table>

        <h2 id="results">10. RESULT INTERPRETATION</h2>
        <h3>10.1 Correlation of Findings</h3>
        <div class="note">
            <strong>Important:</strong> Always correlate physical, chemical, and microscopic findings
        </div>

        <table>
            <thead>
                <tr>
                    <th>Chemical Finding</th>
                    <th>Expected Microscopic</th>
                    <th>If Discordant</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Positive Blood</td>
                    <td>RBCs present</td>
                    <td>Consider hemoglobin/myoglobin</td>
                </tr>
                <tr>
                    <td>Positive Leukocytes</td>
                    <td>WBCs present</td>
                    <td>Check for lysis</td>
                </tr>
                <tr>
                    <td>Positive Nitrite</td>
                    <td>Bacteria present</td>
                    <td>Consider timing</td>
                </tr>
                <tr>
                    <td>High Protein</td>
                    <td>May see casts</td>
                    <td>Check specific gravity</td>
                </tr>
            </tbody>
        </table>

        <h3>10.2 Critical Values</h3>
        <div class="critical">
            <h4>Notify Provider Immediately:</h4>
            <ul>
                <li>Glucose ≥ 1000 mg/dL</li>
                <li>Ketones: Large</li>
                <li>RBC casts: Any present</li>
                <li>WBC casts: >5/LPF</li>
                <li>Pathological crystals (cystine, leucine, tyrosine)</li>
            </ul>
        </div>

        <h3>10.3 Reflex Testing</h3>
        <table>
            <thead>
                <tr>
                    <th>Initial Result</th>
                    <th>Reflex Test</th>
                    <th>Reason</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Protein ≥ 100 mg/dL</td>
                    <td>Protein/Creatinine ratio</td>
                    <td>Quantify proteinuria</td>
                </tr>
                <tr>
                    <td>Positive Glucose</td>
                    <td>Confirm with chemistry</td>
                    <td>Rule out false positive</td>
                </tr>
                <tr>
                    <td>Large Blood, no RBCs</td>
                    <td>Myoglobin test</td>
                    <td>Differentiate cause</td>
                </tr>
            </tbody>
        </table>

        <h2 id="maintenance">11. MAINTENANCE</h2>
        <h3>11.1 Daily Maintenance</h3>
        <ul>
            <li>Clean test table with 10% bleach solution</li>
            <li>Wipe external surfaces with approved disinfectant</li>
            <li>Check printer paper supply</li>
            <li>Empty waste container if needed</li>
            <li>Document in maintenance log</li>
        </ul>

        <h3>11.2 Weekly Maintenance</h3>
        <ul>
            <li>Run instrument cleaning cycle</li>
            <li>Clean barcode reader lens</li>
            <li>Check and clean ventilation filters</li>
            <li>Verify temperature in reagent storage areas</li>
        </ul>

        <h3>11.3 Monthly Maintenance</h3>
        <ul>
            <li>Perform calibration verification</li>
            <li>Review QC trends</li>
            <li>Check expiration dates of all reagents</li>
            <li>Update instrument software if needed</li>
        </ul>

        <h2 id="troubleshooting">12. TROUBLESHOOTING</h2>
        <h3>12.1 Instrument Issues</h3>
        <table>
            <thead>
                <tr>
                    <th>Problem</th>
                    <th>Possible Cause</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Will not power on</td>
                    <td>Power connection</td>
                    <td>Check cord, outlet, breaker</td>
                </tr>
                <tr>
                    <td>Error: "Strip not detected"</td>
                    <td>Improper placement</td>
                    <td>Reposition strip, clean sensors</td>
                </tr>
                <tr>
                    <td>Inconsistent results</td>
                    <td>Dirty optics</td>
                    <td>Run cleaning cycle</td>
                </tr>
                <tr>
                    <td>Paper jam</td>
                    <td>Printer issue</td>
                    <td>Clear jam, check paper path</td>
                </tr>
                <tr>
                    <td>QC repeatedly fails</td>
                    <td>Multiple factors</td>
                    <td>See Section 7.2</td>
                </tr>
            </tbody>
        </table>

        <h3>12.2 Result Issues</h3>
        <table>
            <thead>
                <tr>
                    <th>Issue</th>
                    <th>Investigation</th>
                    <th>Resolution</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>All parameters positive</td>
                    <td>Check specimen integrity</td>
                    <td>Request new specimen</td>
                </tr>
                <tr>
                    <td>No microscopic elements</td>
                    <td>Check centrifuge speed</td>
                    <td>Verify 400g setting</td>
                </tr>
                <tr>
                    <td>Discordant results</td>
                    <td>Review all findings</td>
                    <td>Consider interfering substances</td>
                </tr>
            </tbody>
        </table>

        <h2 id="extra-tube">13. EXTRA TUBE PROCEDURE</h2>
        <div class="image-container">
            <img src="{base64_images.get('extra_tube', '')}" alt="Extra Tube Procedure" />
            <div class="image-caption">Extra Tube Procedure - Visual guide showing proper extra tube labeling and bagging procedure</div>
        </div>

        <h3>13.1 When to Use Extra Tube</h3>
        <ul>
            <li>When additional testing is required</li>
            <li>For reflex testing protocols</li>
            <li>When specimen volume is adequate for multiple tests</li>
            <li>For culture correlation when indicated</li>
        </ul>

        <h3>13.2 Procedure</h3>
        <ol>
            <li>Label extra tube with same patient information</li>
            <li>Add appropriate suffix (e.g., "EXTRA" or "2")</li>
            <li>Transfer adequate volume maintaining sterility</li>
            <li>Store according to test requirements</li>
            <li>Document in laboratory log</li>
        </ol>

        <h2 id="references">14. REFERENCES</h2>
        <ol>
            <li>Clinical and Laboratory Standards Institute (CLSI). Urinalysis; Approved Guideline—Third Edition. CLSI document GP16-A3. Wayne, PA: Clinical and Laboratory Standards Institute; 2009.</li>
            <li>Siemens Healthineers. CLINITEK Novus Operator's Manual. Version 2.0. 2020.</li>
            <li>Brunzel NA. Fundamentals of Urine and Body Fluid Analysis. 4th ed. St. Louis, MO: Elsevier; 2018.</li>
            <li>McPherson RA, Pincus MR. Henry's Clinical Diagnosis and Management by Laboratory Methods. 24th ed. Philadelphia, PA: Elsevier; 2022.</li>
            <li>College of American Pathologists (CAP). Urinalysis Survey. Northfield, IL: CAP; 2023.</li>
        </ol>

        <div class="footer">
            <p><strong>Document Control:</strong> This is a controlled document. Any printed copies are for reference only.</p>
            <p><strong>Version:</strong> 3.0 | <strong>Effective Date:</strong> {datetime.now().strftime('%B %d, %Y')} | <strong>Review Date:</strong> Annual</p>
            <p><strong>Approved By:</strong> Laboratory Director | <strong>Date:</strong> {datetime.now().strftime('%B %d, %Y')}</p>
        </div>
    </div>
</body>
</html>"""

# Save the HTML file
output_path = '/Users/ugochi141/Desktop/KP SOP/SOP/Largo Laboratory-Urinalysis Procedure.html'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("=" * 50)
print("🎯 FINAL COMPLETE HTML FILE CREATED!")
print(f"📁 Location: {output_path}")
print("=" * 50)
print(f"📊 FINAL SUMMARY:")
print(f"✅ Successfully embedded: {len([k for k, v in base64_images.items() if v])} images")
print(f"❌ Could not find: {len([k for k, v in base64_images.items() if not v])} images")

successful_images = [k for k, v in base64_images.items() if v]
failed_images = [k for k, v in base64_images.items() if not v]

if successful_images:
    print("\n✅ SUCCESSFULLY EMBEDDED IMAGES:")
    for img in successful_images:
        print(f"   ✓ {img}")

if failed_images:
    print("\n❌ IMAGES NOT FOUND:")
    for img in failed_images:
        print(f"   ✗ {img}")

print("\n🎊 TASK COMPLETED!")
print("✓ All available PNG and JPG images converted to base64")
print("✓ Images properly placed in requested document sections")
print("✓ HTML file is self-contained and portable")
print("✓ Kaiser Permanente references removed")
print("✓ Professional laboratory document styling maintained")
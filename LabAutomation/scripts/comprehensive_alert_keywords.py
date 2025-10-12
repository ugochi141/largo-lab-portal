#!/usr/bin/env python3
"""
Kaiser Permanente Lab Automation System
Comprehensive Alert Keywords and Triggers

Complete keyword configuration for all lab dashboards and operations.
Ensures proper routing of alerts to Teams and appropriate Notion databases.
"""

DASHBOARD_KEYWORD_TRIGGERS = {
    
    # 📊 Staff Performance Tracker
    "staff_performance": {
        "database_id": "264d222751b381ee84baeba1415e8c32",
        "keywords": [
            "staff performance", "employee metrics", "individual performance",
            "performance review", "staff evaluation", "productivity report",
            "employee score", "tech performance", "staff TAT", "personal metrics"
        ],
        "auto_triggers": {
            "performance_drop": "score < 70 for 3 consecutive days",
            "attendance_issue": "3+ tardies in 7 days",
            "training_needed": "error_rate > 5%"
        }
    },
    
    # 🖥️ Station Monitor
    "station_monitor": {
        "keywords": [
            "station", "workstation", "bench", "analyzer station",
            "chemistry bench", "hematology station", "coag bench",
            "urinalysis station", "micro bench", "phlebotomy station",
            "station status", "bench coverage", "station assignment"
        ],
        "auto_triggers": {
            "unmanned_station": "no_coverage > 15 minutes",
            "station_backlog": "pending_samples > 20"
        }
    },
    
    # ⏰ Break & Attendance Log
    "break_attendance": {
        "database_ids": [
            "264d222751b381d087f8dd7bbf15fa70",
            "264d222751b381dcba51fb1ce47ec3cc",
            "264d222751b38150a009f800c238a3a8"
        ],
        "keywords": [
            "break", "lunch", "attendance", "tardy", "late arrival",
            "early departure", "absence", "call out", "no show",
            "overtime", "extra hours", "FMLA", "sick leave", "PTO",
            "occurrence", "time clock", "punch in", "punch out",
            "break exceeded", "extended lunch", "unauthorized absence"
        ],
        "auto_triggers": {
            "break_violation": "break_duration > 60 minutes",
            "attendance_pattern": "3+ occurrences in 30 days",
            "overtime_alert": "weekly_hours > 44"
        }
    },
    
    # 🎯 Quality & Error Tracking
    "quality_error": {
        "database_id": "264d222751b3816baabcf476e43682ab",
        "keywords": [
            "QC failure", "quality control", "error", "mistake",
            "misidentification", "wrong patient", "incorrect result",
            "contamination", "specimen rejection", "redraw", "recollect",
            "delta check", "critical repeat", "proficiency testing",
            "CAP failure", "linearity", "calibration error", "QC out"
        ],
        "auto_triggers": {
            "qc_failure": "2+ failures same instrument",
            "error_trend": "3+ errors same type in 24 hours",
            "critical_error": "patient_impact = true"
        }
    },
    
    # 🚨 Active Alerts
    "active_alerts": {
        "keywords": [
            "alert", "alarm", "warning", "critical", "urgent",
            "immediate attention", "action required", "escalation",
            "notification", "priority", "emergency", "stat delay",
            "system down", "all stop", "code", "rapid response"
        ],
        "auto_triggers": {
            "immediate": "priority = critical",
            "escalation": "unresolved > 30 minutes"
        }
    },
    
    # 💼 Healthcare IT Portfolio Projects
    "it_projects": {
        "keywords": [
            "IT project", "system upgrade", "implementation", "go-live",
            "downtime", "maintenance window", "interface", "HL7",
            "LIS update", "EMR integration", "middleware", "connectivity",
            "validation", "testing", "cutover", "rollback"
        ]
    },
    
    # ✅ Project Tasks & Issues
    "project_tasks": {
        "database_id": "264d222751b381a8aac7d89624ed0f2a",
        "keywords": [
            "project task", "milestone", "deliverable", "deadline",
            "project issue", "blocker", "dependency", "risk",
            "project status", "gantt", "timeline", "resource",
            "project update", "steering committee", "stakeholder"
        ]
    },
    
    # 📈 Lab Performance Tracker (Overall)
    "lab_performance": {
        "database_ids": [
            "c1500b1816b14018beabe2b826ccafe9",
            "264d222751b381d4a1a3c7f603b95ab4"
        ],
        "keywords": [
            "lab performance", "TAT", "turnaround time", "KPI",
            "service level", "volume", "throughput", "capacity",
            "utilization", "efficiency", "productivity metrics",
            "benchmark", "target", "goal", "SLA", "compliance rate"
        ],
        "auto_triggers": {
            "tat_breach": "TAT > 60 minutes for routine",
            "volume_spike": "hourly_volume > 150% average",
            "efficiency_drop": "productivity < 80%"
        }
    },
    
    # 🔬 Instrument-Specific Keywords
    "instruments": {
        "sysmex": {
            "database_id": "264d222751b38148a3e4fe49dfe54c0e",
            "keywords": ["sysmex", "XN-1000", "XN-2000", "hematology", "CBC", "diff", "blood count"]
        },
        "cobas": {
            "database_id": "264d222751b38116acd1db3aba591407",
            "keywords": ["cobas", "pure", "chemistry", "BMP", "CMP", "liver panel", "lipid"]
        },
        "stago": {
            "database_id": "264d222751b3817f916cf308baf63fbc",
            "keywords": ["stago", "coagulation", "PT", "PTT", "INR", "D-dimer", "fibrinogen"]
        },
        "urinalysis": {
            "database_id": "264d222751b3814b97b3cc03ac45f75c",
            "keywords": ["UA", "urinalysis", "urine", "UN-2000", "CLINITEK", "UF-5000", "micro"]
        },
        "genexpert": {
            "database_id": "264d222751b381e28e4be9e209f8bc27",
            "keywords": ["cepheid", "genexpert", "PCR", "molecular", "COVID", "flu", "RSV", "MRSA"]
        }
    },
    
    # 📅 Scheduling & Rotation
    "scheduling": {
        "database_ids": [
            "264d222751b3815e84f3d92e7e122900",
            "1d6d222751b380d7b8cfc119c1d1711f"
        ],
        "keywords": [
            "schedule", "rotation", "bench assignment", "shift",
            "day shift", "evening shift", "night shift", "weekend",
            "on-call", "coverage", "staff schedule", "time off request"
        ]
    },
    
    # 🚨 Critical Values
    "critical_values": {
        "database_id": "264d222751b381a88178caf003639c40",
        "keywords": [
            "critical value", "panic value", "critical result",
            "urgent callback", "physician notification", "stat",
            "life threatening", "critical high", "critical low"
        ],
        "auto_triggers": {
            "callback_required": "immediate",
            "documentation": "within 5 minutes"
        }
    },
    
    # 📦 Supply & Inventory
    "inventory": {
        "database_ids": [
            "264d222751b381fb866fe47f66279495",
            "264d222751b3811e943cf6d20c489235"
        ],
        "keywords": [
            "inventory", "supplies", "reagent", "consumables",
            "stock", "shortage", "backorder", "expiration",
            "order", "par level", "reorder point", "vendor"
        ],
        "auto_triggers": {
            "low_stock": "quantity < 20% of par",
            "expiring_soon": "expires within 7 days"
        }
    },
    
    # ⚖️ Regulatory & Compliance
    "regulatory": {
        "database_ids": [
            "264d222751b3815a9b85f3189b5f18d6",
            "264d222751b381939a56d042807e667e"
        ],
        "keywords": [
            "CAP", "CLIA", "inspection", "audit", "compliance",
            "regulation", "deficiency", "citation", "corrective action",
            "validation", "competency", "proficiency", "survey"
        ]
    },
    
    # 📢 Communication
    "communication": {
        "database_id": "264d222751b381a490a7fda5befdf819",
        "keywords": [
            "huddle", "meeting", "announcement", "communication",
            "memo", "update", "newsletter", "briefing", "handoff",
            "shift report", "passdown", "action item"
        ]
    }
}

# Alert keywords with priority and color coding
ALERT_KEYWORDS = {
    # Critical Performance Alerts
    "critical": {
        "keywords": ["critical", "emergency", "urgent", "failure", "crashed", "down", "offline"],
        "thresholds": {
            "TAT": "> 60",  # minutes
            "error_rate": "> 5",  # errors per hour
            "performance_score": "< 50"
        },
        "color": "FF0000",  # Red
        "priority": "high"
    },
    
    # Performance Metrics
    "performance": {
        "keywords": ["TAT", "turnaround", "delay", "backlog", "queue", "pending", "performance"],
        "thresholds": {
            "TAT": "> 30",
            "pending_samples": "> 100"
        },
        "color": "FFA500",  # Orange
        "priority": "medium"
    },
    
    # Quality Control
    "quality": {
        "keywords": ["QC", "quality", "compliance", "accuracy", "error", "mistake", "incorrect", "contamination"],
        "thresholds": {
            "QC_compliance": "< 95",
            "error_count": "> 2"
        },
        "color": "FFFF00",  # Yellow
        "priority": "medium"
    },
    
    # Staffing Issues
    "staffing": {
        "keywords": ["staff", "absence", "overtime", "break", "lunch", "shift", "coverage", "scheduling"],
        "thresholds": {
            "break_duration": "> 60",  # minutes
            "overtime": "> 2"  # hours
        },
        "color": "00BFFF",  # Sky Blue
        "priority": "low"
    },
    
    # Equipment & Systems
    "equipment": {
        "keywords": ["equipment", "instrument", "analyzer", "LIS", "system", "maintenance", "calibration", "malfunction"],
        "thresholds": {
            "downtime": "> 15"  # minutes
        },
        "color": "FF6347",  # Tomato
        "priority": "high"
    },
    
    # Incidents & Safety
    "incident": {
        "keywords": ["incident", "accident", "injury", "spill", "exposure", "safety", "hazard", "violation"],
        "thresholds": {
            "severity": "any"
        },
        "color": "FF0000",  # Red
        "priority": "high"
    },
    
    # Regulatory & Compliance
    "regulatory": {
        "keywords": ["CAP", "CLIA", "inspection", "audit", "compliance", "regulation", "citation", "deficiency"],
        "thresholds": {
            "compliance_score": "< 90"
        },
        "color": "800080",  # Purple
        "priority": "high"
    },
    
    # Supplies & Inventory
    "supplies": {
        "keywords": ["supplies", "inventory", "stock", "shortage", "expired", "order", "reagent", "consumables"],
        "thresholds": {
            "stock_level": "< 20%"
        },
        "color": "008000",  # Green
        "priority": "low"
    },
    
    # Patient Care Impact
    "patient": {
        "keywords": ["STAT", "critical value", "panic", "patient", "physician", "callback", "urgent care"],
        "thresholds": {
            "STAT_TAT": "> 45"  # minutes
        },
        "color": "FF1493",  # Deep Pink
        "priority": "high"
    },
    
    # Daily Operations
    "operations": {
        "keywords": ["daily", "summary", "report", "metrics", "dashboard", "update", "status"],
        "thresholds": {
            "scheduled": "daily"
        },
        "color": "0078D4",  # Blue
        "priority": "low"
    }
}

# Automated trigger patterns
TRIGGER_PATTERNS = {
    "immediate_alert": [
        "system down",
        "all analyzers offline",
        "critical staffing",
        "emergency shutdown",
        "contamination detected",
        "patient safety issue",
        "wrong blood transfusion",
        "specimen lost",
        "critical value not called"
    ],
    
    "escalation_required": [
        "manager approval needed",
        "director notification",
        "medical director input",
        "regulatory response required",
        "patient complaint",
        "CAP deficiency"
    ],
    
    "trend_alerts": [
        "increasing TAT trend",
        "declining performance",
        "rising error rate",
        "staffing pattern concern",
        "multiple QC failures"
    ]
}

# Time-based triggers
SCHEDULED_TRIGGERS = {
    "shift_reports": {
        "times": ["06:45", "14:45", "22:45"],
        "dashboards": ["staff_performance", "station_monitor", "active_alerts"]
    },
    "daily_summary": {
        "times": ["17:00"],
        "dashboards": ["lab_performance", "quality_error", "break_attendance"]
    },
    "weekly_metrics": {
        "day_time": "Friday 15:00",
        "dashboards": ["lab_performance", "staff_performance", "inventory"]
    },
    "qc_review": {
        "times": ["07:00", "15:00", "23:00"],
        "dashboards": ["quality_error", "instruments"]
    },
    "monthly_compliance": {
        "day_time": "Last day 16:00",
        "dashboards": ["regulatory", "quality_error", "lab_performance"]
    }
}

# Escalation matrix based on combinations
ESCALATION_TRIGGERS = {
    "immediate_supervisor": [
        "critical value not called",
        "instrument down > 30 minutes",
        "no bench coverage",
        "specimen lost",
        "QC failure - patient testing stopped"
    ],
    "manager_notification": [
        "multiple QC failures",
        "TAT > 90 minutes",
        "staff injury",
        "regulatory finding",
        "system-wide issue"
    ],
    "director_escalation": [
        "patient complaint",
        "wrong blood transfusion",
        "CAP deficiency",
        "system-wide failure",
        "media inquiry",
        "sentinel event"
    ],
    "medical_director": [
        "critical value documentation issue",
        "physician complaint",
        "clinical correlation needed",
        "unusual test pattern"
    ]
}

# Department-specific triggers
DEPARTMENT_TRIGGERS = {
    "chemistry": {
        "keywords": ["chemistry", "BMP", "CMP", "electrolytes", "glucose", "renal", "liver"],
        "instruments": ["cobas", "architect", "vitros"]
    },
    "hematology": {
        "keywords": ["hematology", "CBC", "differential", "platelet", "hemoglobin", "WBC"],
        "instruments": ["sysmex", "celldyn", "beckman"]
    },
    "coagulation": {
        "keywords": ["coag", "PT", "PTT", "INR", "fibrinogen", "D-dimer", "anticoagulation"],
        "instruments": ["stago", "acl", "sysmex CS"]
    },
    "urinalysis": {
        "keywords": ["UA", "urinalysis", "urine", "microscopy", "culture setup"],
        "instruments": ["clinitek", "UF-5000", "cobas U"]
    },
    "microbiology": {
        "keywords": ["micro", "culture", "gram stain", "sensitivity", "ID", "blood culture"],
        "instruments": ["vitek", "phoenix", "maldi", "bactec"]
    },
    "molecular": {
        "keywords": ["PCR", "molecular", "COVID", "flu", "RSV", "NAAT", "genotyping"],
        "instruments": ["genexpert", "panther", "biofire"]
    },
    "blood_bank": {
        "keywords": ["blood bank", "transfusion", "crossmatch", "antibody", "blood type"],
        "instruments": ["echo", "provue", "vision"]
    }
}

# Metric thresholds by category
METRIC_THRESHOLDS = {
    "tat_critical": {
        "stat": 45,  # minutes
        "routine": 60,
        "non_urgent": 120
    },
    "error_rates": {
        "critical": 5,  # percent
        "warning": 2,
        "acceptable": 1
    },
    "qc_compliance": {
        "minimum": 95,  # percent
        "target": 98,
        "excellent": 99.5
    },
    "staff_performance": {
        "unacceptable": 60,  # score
        "needs_improvement": 70,
        "meets_expectations": 85,
        "exceeds_expectations": 95
    },
    "equipment_uptime": {
        "critical": 85,  # percent
        "target": 95,
        "excellent": 99
    }
}

# Special handling for combined triggers
COMBINED_TRIGGERS = {
    "perfect_storm": {
        "conditions": ["multiple instruments down", "short staffed", "high volume"],
        "action": "immediate all-hands response"
    },
    "quality_crisis": {
        "conditions": ["QC failures > 3", "error rate > 5%", "CAP finding"],
        "action": "stop testing, root cause analysis"
    },
    "staffing_crisis": {
        "conditions": ["call outs > 3", "no float pool", "high volume"],
        "action": "mandatory overtime, manager coverage"
    }
}






"""Lab configuration for automation."""

import os

class LabConfig:
    """Configuration for lab automation system."""
    
    def __init__(self):
        # Load from environment variables
        self.NOTION_API_TOKEN = os.environ.get('NOTION_API_TOKEN', '')
        self.NOTION_PERFORMANCE_DB_ID = os.environ.get('NOTION_PERFORMANCE_DB_ID', 'c1500b1816b14018beabe2b826ccafe9')
        self.NOTION_INCIDENT_DB_ID = os.environ.get('NOTION_INCIDENT_DB_ID', 'cf2bb4448aff4324a602cb770cbae0a2')
        self.NOTION_LAB_MANAGEMENT_CENTER = os.environ.get('NOTION_LAB_MANAGEMENT_CENTER', '266d222751b3818996b4ce1cf18e0913')
        
        self.TEAMS_WEBHOOK_URL = os.environ.get('TEAMS_WEBHOOK_URL', '')
        self.POWERBI_MONITOR_PUSH_URL = os.environ.get('POWERBI_MONITOR_PUSH_URL', '')
        self.POWERBI_METRICS_PUSH_URL = os.environ.get('POWERBI_METRICS_PUSH_URL', '')
        
        # Thresholds
        self.TAT_CRITICAL = 50
        self.TAT_WARNING = 70
        self.TAT_TARGET = 90
        self.WAIT_CRITICAL = 30
        self.WAIT_WARNING = 20
        self.WAIT_TARGET = 15
        
    def validate(self):
        """Validate configuration."""
        if not self.NOTION_API_TOKEN:
            raise ValueError("NOTION_API_TOKEN is not set")
        return True
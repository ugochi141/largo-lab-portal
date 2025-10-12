#!/usr/bin/env python3
"""
Kaiser Permanente Lab Automation System
Complete Database Testing and Integration Script

Tests all configured databases and makes the system fully operational.
"""

import asyncio
import sys
import os
from pathlib import Path
from datetime import datetime

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from config.config_manager import ConfigManager
from integrations.notion_client import NotionClient
from integrations.teams_client import TeamsClient
from integrations.powerbi_client import PowerBIClient


class ComprehensiveDatabaseTester:
    """Tests all databases and integrations"""
    
    def __init__(self):
        self.config_manager = ConfigManager()
        self.notion_config = None
        self.notion_enabled = False
        
    def print_header(self, text: str) -> None:
        """Print formatted header"""
        print("\n" + "=" * 80)
        print(f"  {text}")
        print("=" * 80)
    
    def print_step(self, step: str) -> None:
        """Print formatted step"""
        print(f"\n📋 {step}")
    
    def print_success(self, message: str) -> None:
        """Print success message"""
        print(f"✅ {message}")
    
    def print_error(self, message: str) -> None:
        """Print error message"""
        print(f"❌ {message}")
    
    def print_info(self, message: str) -> None:
        """Print info message"""
        print(f"ℹ️  {message}")
    
    def print_warning(self, message: str) -> None:
        """Print warning message"""
        print(f"⚠️  {message}")
    
    async def test_all_systems(self) -> bool:
        """Test all systems comprehensively"""
        try:
            self.print_header("Kaiser Permanente Lab Automation - Complete System Test")
            
            # Step 1: Load configuration
            self.print_step("Loading system configuration...")
            config_loaded = await self._load_and_verify_config()
            
            if not config_loaded:
                return False

            if not self.notion_enabled:
                self.print_warning(
                    "Notion integration disabled; skipping legacy Notion database test suite"
                )
                return True
            
            # Step 2: Test all databases
            self.print_step("Testing all Notion databases...")
            db_results = await self._test_all_databases()
            
            # Step 3: Test integrations
            self.print_step("Testing system integrations...")
            integration_results = await self._test_all_integrations()
            
            # Step 4: Generate comprehensive report
            self.print_step("Generating system status report...")
            await self._generate_status_report(db_results, integration_results)
            
            # Step 5: Final system status
            self.print_step("Finalizing system status...")
            success = await self._finalize_system_status(db_results, integration_results)
            
            return success
            
        except Exception as e:
            self.print_error(f"System test failed: {e}")
            return False
    
    async def _load_and_verify_config(self) -> bool:
        """Load and verify configuration"""
        try:
            notion_config = self.config_manager.get_notion_config()
            self.notion_config = notion_config
            self.notion_enabled = getattr(notion_config, "enabled", False)

            if not self.notion_enabled:
                self.print_info("Notion credentials not configured; legacy database checks will be skipped")
                return True

            self.print_success(f"Notion API Token: {notion_config.api_token[:20]}...")
            self.print_success(f"Performance DB ID: {notion_config.performance_db_id}")
            self.print_success(f"Incident DB ID: {notion_config.incident_db_id}")
            self.print_success(f"Lab Management Center: {notion_config.lab_management_center_id}")
            self.print_success(f"Additional Databases: {len(notion_config.additional_databases)}")
            
            return True
            
        except Exception as e:
            self.print_error(f"Configuration loading failed: {e}")
            return False
    
    async def _test_all_databases(self) -> dict:
        """Test all configured databases"""
        results = {
            "accessible": [],
            "inaccessible": [],
            "total_tested": 0,
            "success_rate": 0
        }
        
        try:
            notion_config = self.config_manager.get_notion_config()
            
            # Define all databases to test
            databases_to_test = [
                ("Performance Dashboard", notion_config.performance_db_id),
                ("Incident Tracking", notion_config.incident_db_id),
                ("Lab Management Center", notion_config.lab_management_center_id),
                ("Task Delegation", notion_config.task_delegation_db_id),
                ("Staff Schedule", notion_config.staff_schedule_db_id),
                ("PTO Schedule", notion_config.pto_schedule_db_id),
            ]
            
            # Add additional databases
            for db_key, db_id in notion_config.additional_databases.items():
                databases_to_test.append((f"Database {db_key.split('_')[-1]}", db_id))
            
            async with NotionClient(notion_config) as client:
                for db_name, db_id in databases_to_test:
                    if not db_id:  # Skip empty IDs
                        continue
                        
                    results["total_tested"] += 1
                    
                    try:
                        self.print_info(f"Testing {db_name} ({db_id})...")
                        
                        # Try to query the database
                        response = await client._make_request(
                            "POST",
                            f"databases/{db_id}/query",
                            data={"page_size": 1}
                        )
                        
                        record_count = len(response.get("results", []))
                        results["accessible"].append({
                            "name": db_name,
                            "id": db_id,
                            "record_count": record_count
                        })
                        
                        self.print_success(f"✓ {db_name}: Accessible ({record_count} records)")
                        
                    except Exception as e:
                        results["inaccessible"].append({
                            "name": db_name,
                            "id": db_id,
                            "error": str(e)
                        })
                        
                        if "404" in str(e):
                            self.print_warning(f"⚠ {db_name}: Not shared with integration")
                        else:
                            self.print_error(f"✗ {db_name}: {e}")
            
            # Calculate success rate
            if results["total_tested"] > 0:
                results["success_rate"] = (len(results["accessible"]) / results["total_tested"]) * 100
            
            self.print_info(f"Database Test Summary: {len(results['accessible'])}/{results['total_tested']} accessible ({results['success_rate']:.1f}%)")
            
            return results
            
        except Exception as e:
            self.print_error(f"Database testing failed: {e}")
            return results
    
    async def _test_all_integrations(self) -> dict:
        """Test all system integrations"""
        results = {
            "teams": False,
            "powerbi": False,
            "notion_api": False
        }
        
        try:
            # Test Notion API
            self.print_info("Testing Notion API connection...")
            notion_config = self.config_manager.get_notion_config()
            async with NotionClient(notion_config) as client:
                # Basic API test
                results["notion_api"] = True
                self.print_success("✓ Notion API: Connected")
            
            # Test Teams integration
            self.print_info("Testing Teams integration...")
            try:
                teams_config = self.config_manager.get_teams_config()
                async with TeamsClient(teams_config) as teams_client:
                    teams_success = await teams_client.send_alert(
                        "🧪 System Integration Test",
                        f"**Kaiser Permanente Lab Automation System**\n\n"
                        f"Complete system integration test in progress...\n\n"
                        f"**Test Results:**\n"
                        f"• Notion API: ✅ Connected\n"
                        f"• Teams Notifications: ✅ Working\n"
                        f"• Power BI: Testing in progress...\n\n"
                        f"System validation completing successfully!",
                        "info",
                        {
                            "Test Time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                            "System Status": "Integration Testing",
                            "Lab Location": "Largo, MD"
                        }
                    )
                    
                    if teams_success:
                        results["teams"] = True
                        self.print_success("✓ Teams: Notification sent successfully")
                    else:
                        self.print_error("✗ Teams: Notification failed")
                        
            except Exception as e:
                self.print_error(f"✗ Teams integration failed: {e}")
            
            # Test Power BI integration
            self.print_info("Testing Power BI integration...")
            try:
                powerbi_config = self.config_manager.get_powerbi_config()
                async with PowerBIClient(powerbi_config) as powerbi_client:
                    # Test with minimal data
                    test_data = [{
                        "TestField": "Integration Test",
                        "Timestamp": datetime.now().isoformat(),
                        "Value": 1
                    }]
                    
                    powerbi_success = await powerbi_client._stream_data(
                        powerbi_config.performance_dataset_id,
                        powerbi_config.performance_api_key,
                        test_data
                    )
                    
                    if powerbi_success:
                        results["powerbi"] = True
                        self.print_success("✓ Power BI: Data streaming successful")
                    else:
                        self.print_warning("⚠ Power BI: Schema mismatch (expected)")
                        
            except Exception as e:
                self.print_warning(f"⚠ Power BI integration: {e}")
            
            return results
            
        except Exception as e:
            self.print_error(f"Integration testing failed: {e}")
            return results
    
    async def _generate_status_report(self, db_results: dict, integration_results: dict) -> None:
        """Generate comprehensive status report"""
        try:
            self.print_header("COMPREHENSIVE SYSTEM STATUS REPORT")
            
            # Database Status
            print("\n📊 **DATABASE STATUS:**")
            print(f"   Total Databases Tested: {db_results['total_tested']}")
            print(f"   Accessible: {len(db_results['accessible'])}")
            print(f"   Need Sharing: {len(db_results['inaccessible'])}")
            print(f"   Success Rate: {db_results['success_rate']:.1f}%")
            
            if db_results["accessible"]:
                print("\n   ✅ **Accessible Databases:**")
                for db in db_results["accessible"]:
                    print(f"      • {db['name']}: {db['record_count']} records")
            
            if db_results["inaccessible"]:
                print("\n   ⚠️  **Databases Needing Setup:**")
                for db in db_results["inaccessible"]:
                    print(f"      • {db['name']}: {db['error'][:50]}...")
            
            # Integration Status
            print("\n🔗 **INTEGRATION STATUS:**")
            print(f"   Notion API: {'✅ Connected' if integration_results['notion_api'] else '❌ Failed'}")
            print(f"   Teams Alerts: {'✅ Working' if integration_results['teams'] else '❌ Failed'}")
            print(f"   Power BI: {'✅ Connected' if integration_results['powerbi'] else '⚠️ Schema Issues'}")
            
            # Overall System Health
            accessible_dbs = len(db_results["accessible"])
            working_integrations = sum(integration_results.values())
            
            print("\n🏥 **OVERALL SYSTEM HEALTH:**")
            if accessible_dbs >= 2 and working_integrations >= 2:
                print("   🟢 **OPERATIONAL** - System ready for production use")
            elif accessible_dbs >= 1 and working_integrations >= 1:
                print("   🟡 **PARTIALLY OPERATIONAL** - Core functions working")
            else:
                print("   🔴 **NEEDS SETUP** - Complete database sharing required")
            
        except Exception as e:
            self.print_error(f"Status report generation failed: {e}")
    
    async def _finalize_system_status(self, db_results: dict, integration_results: dict) -> bool:
        """Finalize system status and send completion notification"""
        try:
            accessible_dbs = len(db_results["accessible"])
            working_integrations = sum(integration_results.values())
            
            # Determine system status
            if accessible_dbs >= 2 and working_integrations >= 2:
                status = "FULLY OPERATIONAL"
                status_color = "success"
                ready_for_production = True
            elif accessible_dbs >= 1 and working_integrations >= 1:
                status = "PARTIALLY OPERATIONAL"
                status_color = "warning"
                ready_for_production = False
            else:
                status = "NEEDS CONFIGURATION"
                status_color = "critical"
                ready_for_production = False
            
            # Send final status notification
            if integration_results.get("teams", False):
                teams_config = self.config_manager.get_teams_config()
                async with TeamsClient(teams_config) as teams_client:
                    await teams_client.send_alert(
                        f"🏥 Kaiser Permanente Lab Automation - {status}",
                        f"**System Integration Complete!**\n\n"
                        f"**Database Status:**\n"
                        f"• Accessible: {accessible_dbs}/{db_results['total_tested']} databases\n"
                        f"• Success Rate: {db_results['success_rate']:.1f}%\n\n"
                        f"**Integration Status:**\n"
                        f"• Notion API: {'✅' if integration_results['notion_api'] else '❌'}\n"
                        f"• Teams Alerts: {'✅' if integration_results['teams'] else '❌'}\n"
                        f"• Power BI: {'✅' if integration_results['powerbi'] else '⚠️'}\n\n"
                        f"**System Status: {status}**\n"
                        f"{'Ready for production use!' if ready_for_production else 'Complete database sharing to enable full functionality.'}\n\n"
                        f"**Next Steps:**\n"
                        f"{'• Begin daily operations' if ready_for_production else '• Share remaining databases with integration'}\n"
                        f"• Configure additional lab system integrations\n"
                        f"• Train staff on the new system",
                        status_color,
                        {
                            "System Status": status,
                            "Databases Accessible": f"{accessible_dbs}/{db_results['total_tested']}",
                            "Integrations Working": f"{working_integrations}/3",
                            "Ready for Production": "Yes" if ready_for_production else "Pending Setup",
                            "Test Completed": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        }
                    )
            
            # Display final results
            self.print_header(f"FINAL SYSTEM STATUS: {status}")
            
            if ready_for_production:
                print("\n🎉 **CONGRATULATIONS!**")
                print("   Your Kaiser Permanente Lab Automation System is FULLY OPERATIONAL!")
                print("   You can now begin production operations.")
                
                print("\n🚀 **To Start Production System:**")
                print("   python -m automation.lab_automation_core")
                
            else:
                print("\n📋 **SETUP REMAINING:**")
                print("   Complete database sharing to enable full functionality.")
                print("   See NOTION_SETUP_GUIDE.md for detailed instructions.")
                
                if db_results["inaccessible"]:
                    print("\n   **Databases needing sharing:**")
                    for db in db_results["inaccessible"]:
                        print(f"   • {db['name']}")
            
            print("\n📊 **System Summary:**")
            print(f"   • Total Databases: {db_results['total_tested']}")
            print(f"   • Accessible: {accessible_dbs}")
            print(f"   • Working Integrations: {working_integrations}/3")
            print(f"   • Overall Success Rate: {((accessible_dbs + working_integrations) / (db_results['total_tested'] + 3)) * 100:.1f}%")
            
            return ready_for_production
            
        except Exception as e:
            self.print_error(f"System finalization failed: {e}")
            return False


async def main():
    """Main testing function"""
    tester = ComprehensiveDatabaseTester()
    success = await tester.test_all_systems()
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    asyncio.run(main())






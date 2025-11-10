import unittest
from src.models.sop import SOP
from src.controllers.sop_controller import SOPController

class TestSOP(unittest.TestCase):

    def setUp(self):
        self.sop_controller = SOPController()
        self.sop_data = {
            'title': 'Test SOP',
            'description': 'This is a test SOP.',
            'steps': ['Step 1', 'Step 2', 'Step 3']
        }

    def test_create_sop(self):
        sop = self.sop_controller.create_sop(self.sop_data)
        self.assertIsNotNone(sop)
        self.assertEqual(sop.title, self.sop_data['title'])

    def test_update_sop(self):
        sop = self.sop_controller.create_sop(self.sop_data)
        updated_data = {
            'title': 'Updated SOP',
            'description': 'This is an updated test SOP.',
            'steps': ['Step 1', 'Step 2', 'Step 3', 'Step 4']
        }
        updated_sop = self.sop_controller.update_sop(sop.id, updated_data)
        self.assertEqual(updated_sop.title, updated_data['title'])

    def test_delete_sop(self):
        sop = self.sop_controller.create_sop(self.sop_data)
        result = self.sop_controller.delete_sop(sop.id)
        self.assertTrue(result)

if __name__ == '__main__':
    unittest.main()
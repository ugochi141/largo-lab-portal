class SOP:
    def __init__(self, title, description, steps):
        self.title = title
        self.description = description
        self.steps = steps

    def create(self):
        # Logic to create a new SOP
        pass

    def update(self, title=None, description=None, steps=None):
        # Logic to update the SOP
        if title:
            self.title = title
        if description:
            self.description = description
        if steps:
            self.steps = steps

    def delete(self):
        # Logic to delete the SOP
        pass
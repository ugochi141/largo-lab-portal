class SOPController:
    def __init__(self, sop_model):
        self.sop_model = sop_model

    def get_sop(self, sop_id):
        return self.sop_model.get(sop_id)

    def create_sop(self, title, description, steps):
        sop = self.sop_model(title=title, description=description, steps=steps)
        sop.create()
        return sop

    def delete_sop(self, sop_id):
        return self.sop_model.delete(sop_id)
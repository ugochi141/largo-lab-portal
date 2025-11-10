def format_sop_title(title):
    return title.strip().title()

def validate_sop_steps(steps):
    if not isinstance(steps, list):
        raise ValueError("Steps must be a list.")
    if not all(isinstance(step, str) for step in steps):
        raise ValueError("All steps must be strings.")
    return True

def format_description(description):
    return description.strip()
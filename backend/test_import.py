import sys
sys.path.append('.')

try:
    from app.models import Task
    print("Successfully imported Task from app.models")
except ImportError as e:
    print(f"ImportError: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
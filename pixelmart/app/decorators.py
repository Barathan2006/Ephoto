from functools import wraps
from flask import abort, flash, redirect, url_for
from flask_login import current_user

def admin_required(f):
    """Decorator to restrict route access exclusively to users with role='admin'."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            flash('You must log in to view the administrator panel.', 'warning')
            return redirect(url_for('auth.login'))
        if current_user.role != 'admin':
            abort(403)
        return f(*args, **kwargs)
    return decorated_function

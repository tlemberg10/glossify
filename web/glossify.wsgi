import sys
sys.path.insert(0, '/var/www/glossify')
sys.path.insert(0, '/var/www/glossify/web')
sys.path.insert(0, '/var/www/glossify/web/pylib')
sys.path.insert(0, '/var/www/glossify/web/site-packages')

from main import app_instance as application

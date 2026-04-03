@echo off
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pdave123 < C:\Users\lemah\Documents\Playground\scripts\init_db.sql
echo Exit code: %ERRORLEVEL%

@echo off
echo Cleaning project...
del array.js config.js dead-clicks-autocapture.js exception-autocapture.js surveys.js web-vitals.js
rd /s /q a_data
echo Done! Now keep only index.html and css2.css.
pause
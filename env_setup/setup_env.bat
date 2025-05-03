@echo off
echo Setting up environment for Space Station Object Detection System

:: Create Python virtual environment
echo Creating Python virtual environment...
python -m venv venv
call venv\Scripts\activate

:: Install Python dependencies
echo Installing Python dependencies...
pip install --upgrade pip
pip install ultralytics opencv-python fastapi uvicorn pydantic python-multipart scikit-learn matplotlib seaborn pandas pillow

:: Create directories if they don't exist
echo Creating project directories...
mkdir ..\dataset\Train\images
mkdir ..\dataset\Train\labels
mkdir ..\dataset\Val\images
mkdir ..\dataset\Val\labels
mkdir ..\dataset\Test\images
mkdir ..\dataset\Test\labels
mkdir ..\uploads
mkdir ..\backend\model

:: Install Node.js dependencies
echo Installing Node.js dependencies...
cd ..
npm install

:: Create sample data in database
echo Setting up database...
npm run db:push
npm run db:seed

echo.
echo Environment setup complete!
echo.
echo To start the application:
echo 1. Activate the Python environment: venv\Scripts\activate
echo 2. Run the server: npm run dev
echo.
echo To train the model:
echo 1. Place your dataset in the dataset directory
echo 2. Run the Jupyter notebook: notebooks/object_detection.ipynb
echo.

pause

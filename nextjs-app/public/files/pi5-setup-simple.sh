#!/bin/bash

# Raspberry Pi 5 Simple Setup Script
# Home Assistant Core (no Docker required)

set -e  # Exit on any error

echo "🚀 Starting Raspberry Pi 5 Simple Setup"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as regular user."
   exit 1
fi

# Check if running on Raspberry Pi
if ! grep -q "Raspberry Pi" /proc/cpuinfo; then
    print_error "This script must be run on a Raspberry Pi"
    exit 1
fi

print_status "Detected Raspberry Pi - continuing setup..."
echo ""

# Check internet connectivity
print_status "Checking internet connectivity..."
if ! ping -c 1 -W 5 8.8.8.8 &> /dev/null; then
    print_error "No internet connection detected!"
    print_error "Please check your network connection and try again."
    exit 1
fi
print_success "Internet connectivity verified"
echo ""

# Update system packages
print_status "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

print_success "System packages updated"
echo ""

# Install essential dependencies
print_status "Installing essential dependencies..."
sudo apt-get install -y \
    git \
    curl \
    wget \
    vim \
    nano \
    build-essential \
    python3-dev \
    python3-pip \
    python3-venv \
    python3-wheel \
    libffi-dev \
    libssl-dev \
    libjpeg-dev \
    zlib1g-dev \
    alsa-utils \
    pulseaudio \
    pulseaudio-utils

print_success "Essential dependencies installed"
echo ""

# Install Python dependencies for Home Assistant
print_status "Installing Python dependencies..."
sudo apt-get install -y \
    libxml2-dev \
    libxslt-dev \
    libyaml-dev \
    unzip

print_success "Python dependencies installed"
echo ""

# Configure WM8960 Audio HAT
print_status "Configuring WM8960 Audio HAT..."

# Enable WM8960 in device tree
sudo bash -c 'cat >> /boot/config.txt << EOF

# WM8960 Audio HAT Configuration
dtoverlay=seeed-voicecard
EOF'

# Disable onboard audio
sudo sed -i 's/dtparam=audio=on/#dtparam=audio=on/' /boot/config.txt

# Configure ALSA
sudo bash -c 'cat > /etc/asound.conf << EOF
defaults.pcm.card 1
defaults.ctl.card 1
EOF'

# Configure PulseAudio
sudo bash -c 'cat >> /etc/pulse/daemon.conf << EOF

# Low latency configuration for gaming
default-sample-rate = 48000
default-sample-format = s24le
default-sample-channels = 2
default-fragments = 2
default-fragment-size-msec = 5
EOF'

print_success "WM8960 Audio HAT configured"
echo ""

# Configure RaspBee II Zigbee HAT
print_status "Configuring RaspBee II Zigbee HAT..."

# Enable SPI for RaspBee II
sudo raspi-config nonint do_spi 0

# Enable I2C for RaspBee II (if needed)
sudo raspi-config nonint do_i2c 0

# Add kernel module configuration
sudo bash -c 'cat > /etc/modprobe.d/raspbee2.conf << EOF
# RaspBee II configuration
options spidev buf_size=4096
EOF'

print_success "RaspBee II Zigbee HAT configured"
echo ""

# Create Home Assistant user and directory
print_status "Setting up Home Assistant..."
sudo adduser --system --group --no-create-home --gecos "Home Assistant" homeassistant

# Create Home Assistant directory
sudo mkdir -p /home/homeassistant
sudo chown homeassistant:homeassistant /home/homeassistant

# Create Python virtual environment for Home Assistant
print_status "Creating Python virtual environment..."
sudo -u homeassistant python3 -m venv /home/homeassistant/homeassistant

# Install Home Assistant Core
print_status "Installing Home Assistant Core..."
sudo -u homeassistant /home/homeassistant/homeassistant/bin/pip install --upgrade pip
sudo -u homeassistant /home/homeassistant/homeassistant/bin/pip install wheel

# Install Home Assistant
sudo -u homeassistant /home/homeassistant/homeassistant/bin/pip install homeassistant

print_success "Home Assistant Core installed"
echo ""

# Create Home Assistant systemd service
print_status "Creating Home Assistant service..."
sudo bash -c 'cat > /etc/systemd/system/home-assistant.service << EOF
[Unit]
Description=Home Assistant Core
After=network-online.target

[Service]
Type=simple
User=homeassistant
WorkingDirectory=/home/homeassistant
Environment="PATH=/home/homeassistant/homeassistant/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=/home/homeassistant/homeassistant/bin/hass -c "/home/homeassistant/.homeassistant"

[Install]
WantedBy=multi-user.target
EOF'

sudo systemctl daemon-reload
sudo systemctl enable home-assistant.service

print_success "Home Assistant service created and enabled"
echo ""

# Create audio file directories
print_status "Creating audio file directories..."
sudo mkdir -p /home/homeassistant/.homeassistant/www/sounds/gaming/effects
sudo mkdir -p /home/homeassistant/.homeassistant/www/sounds/gaming/background
sudo chown -R homeassistant:homeassistant /home/homeassistant/.homeassistant

print_success "Audio file directories created"
echo ""

# Print summary
echo "🎉 Raspberry Pi 5 Simple Setup Complete!"
echo "========================================"
echo ""
echo "✅ Home Assistant Core installed (no Docker!)"
echo "✅ WM8960 Audio HAT configured"
echo "✅ RaspBee II Zigbee HAT configured"
echo "✅ Audio directories created"
echo ""
echo "Next steps:"
echo "1. Reboot the system: sudo reboot"
echo "2. After reboot, Home Assistant will start automatically"
echo "3. Access Home Assistant at: http://raspberrypi.local:8123"
echo "4. Complete Home Assistant onboarding"
echo "5. Install Zigbee integration via Home Assistant UI"
echo ""
echo "Home Assistant config directory:"
echo "  /home/homeassistant/.homeassistant"
echo ""
print_success "Setup completed successfully!"


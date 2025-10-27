#!/bin/bash

# Raspberry Pi 5 Setup Script for Tabletop Gaming Home Assistant
# This script automates the setup of Home Assistant with WM8960 Audio HAT and RaspBee II Zigbee HAT

set -e  # Exit on any error

echo "🚀 Starting Raspberry Pi 5 Setup for Tabletop Gaming Home Assistant"
echo "=================================================================="

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
   print_error "This script should not be run as root. Please run as regular user (pi)."
   exit 1
fi

# Check if running on Raspberry Pi
if ! grep -q "Raspberry Pi" /proc/cpuinfo; then
    print_error "This script must be run on a Raspberry Pi"
    exit 1
fi

print_status "Detected Raspberry Pi - continuing setup..."
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
    libffi-dev \
    libssl-dev \
    alsa-utils \
    pulseaudio \
    pulseaudio-utils

print_success "Essential dependencies installed"
echo ""

# Install Home Assistant Supervised
print_status "Installing Home Assistant Supervised..."
print_warning "This will take 15-20 minutes. Please be patient..."

# Install prerequisites for Home Assistant Supervised
sudo apt-get install -y \
    apparmor \
    jq \
    udisks2 \
    libglib2.0-bin \
    network-manager \
    dbus \
    systemd-journal-remote \
    systemd-resolved

# Install Home Assistant Supervised
sudo systemctl disable ModemManager
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Home Assistant OS-Agent
os_agent_version=$(curl -s https://api.github.com/repos/home-assistant/os-agent/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
os_agent_url="https://github.com/home-assistant/os-agent/releases/download/${os_agent_version}/os-agent_${os_agent_version}_linux_aarch64.deb"
sudo apt-get install -y "${os_agent_url}"

# Install Home Assistant Supervised
curl -fsSL https://github.com/home-assistant/supervised-installer/releases/latest/download/hassio_install.sh | bash -s

print_success "Home Assistant Supervised installed successfully"
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

# Add kernel module configuration
sudo bash -c 'cat > /etc/modprobe.d/raspbee2.conf << EOF
# RaspBee II configuration
options spidev buf_size=4096
EOF'

# Enable UART for RaspBee II firmware updates
sudo systemctl enable serial-getty@ttyAMA0.service

print_success "RaspBee II Zigbee HAT configured"
echo ""

# Create audio file directories
print_status "Creating audio file directories..."
sudo mkdir -p /usr/share/hassio/homeassistant/www/sounds/gaming/effects
sudo mkdir -p /usr/share/hassio/homeassistant/www/sounds/gaming/background

# Set proper permissions
sudo chown -R root:root /usr/share/hassio/homeassistant/www
sudo chmod -R 755 /usr/share/hassio/homeassistant/www

print_success "Audio file directories created"
echo ""

# Create service for PulseAudio
print_status "Creating PulseAudio service..."
sudo bash -c 'cat > /etc/systemd/system/pulseaudio.service << EOF
[Unit]
Description=PulseAudio Daemon
After=sound.target

[Service]
Type=notify
ExecStart=/usr/bin/pulseaudio --system --disallow-exit --realtime --no-cpu-limit

[Install]
WantedBy=multi-user.target
EOF'

sudo systemctl daemon-reload
sudo systemctl enable pulseaudio.service

print_success "PulseAudio service configured"
echo ""

# Print summary
echo "🎉 Raspberry Pi 5 Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Reboot the system: sudo reboot"
echo "2. After reboot, Home Assistant will be available at: http://localhost:8123"
echo "3. Complete Home Assistant onboarding"
echo "4. Install deCONZ add-on from Home Assistant Add-on Store"
echo "5. Configure WM8960 Audio HAT in Home Assistant"
echo "6. Upload audio files to /usr/share/hassio/homeassistant/www/sounds/gaming/"
echo ""
print_success "Setup script completed successfully!"

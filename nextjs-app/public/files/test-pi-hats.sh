#!/bin/bash

# Raspberry Pi 5 HAT Testing Script
# Tests WM8960 Audio HAT and RaspBee II Zigbee HAT
# Run this after installing the HATs to verify they're working

set -e

echo "🧪 Starting Raspberry Pi 5 HAT Testing"
echo "======================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
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

echo "✅ Running on Raspberry Pi - continuing tests..."
echo ""

# ============================================
# Test 1: Hardware Detection
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 1: Hardware Detection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

print_status "Checking Raspberry Pi Model..."
PI_MODEL=$(cat /proc/device-tree/model)
print_success "Detected: $PI_MODEL"

print_status "Checking SPI is enabled..."
if [ -d /dev/spidev* ]; then
    SPI_DEVICES=$(ls /dev/spidev*)
    print_success "SPI enabled - found: $SPI_DEVICES"
else
    print_error "SPI not found - RaspBee II may not work"
fi

print_status "Checking I2C is enabled..."
if [ -d /dev/i2c-* ]; then
    I2C_DEVICES=$(ls /dev/i2c-*)
    print_success "I2C enabled - found: $I2C_DEVICES"
else
    print_error "I2C not found - WM8960 may not work"
fi

echo ""

# ============================================
# Test 2: WM8960 Audio HAT Tests
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 2: WM8960 Audio HAT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

print_status "Checking for WM8960 audio device..."
if aplay -l | grep -i "wm8960\|seeed"; then
    print_success "WM8960 Audio HAT detected"
    aplay -l
else
    print_error "WM8960 Audio HAT not detected"
    print_warning "Check /boot/config.txt for dtoverlay=seeed-voicecard"
fi
echo ""

print_status "Testing audio card access..."
if arecord -l 2>/dev/null | grep -q .; then
    print_success "Audio input devices accessible"
    arecord -l
else
    print_warning "No audio input devices found (this may be OK)"
fi
echo ""

print_status "Testing audio output..."
if speaker-test -t sine -f 440 -l 1 -s 1 -c 2 2>/dev/null; then
    print_success "WM8960 speakers working - you should have heard a 440Hz tone"
else
    print_error "Audio output test failed"
    print_warning "This could be a driver issue or missing dependencies"
fi
echo ""

# ============================================
# Test 3: RaspBee II Zigbee HAT Tests
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 3: RaspBee II Zigbee HAT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

print_status "Checking for RaspBee II on SPI..."
if lsmod | grep -q spidev; then
    print_success "SPI module loaded"
    lsmod | grep spidev
else
    print_error "SPI module not loaded"
fi
echo ""

print_status "Checking for RaspBee II device files..."
if ls /dev/spidev* 2>/dev/null; then
    print_success "SPI devices found"
else
    print_error "No SPI devices found - RaspBee II may not be connected properly"
fi
echo ""

print_status "Checking for RaspBee II on I2C..."
if i2cdetect -y 1 | grep -q "18\|19\|1a\|1b"; then
    print_success "RaspBee II I2C detected"
    print_status "RaspBee II I2C addresses found:"
    i2cdetect -y 1 | grep -E "18|19|1a|1b"
else
    print_warning "RaspBee II I2C not detected - this may be normal"
fi
echo ""

# ============================================
# Test 4: System Configuration
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 4: System Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

print_status "Checking /boot/config.txt for HAT configuration..."
if grep -q "dtoverlay=seeed-voicecard" /boot/config.txt; then
    print_success "WM8960 HAT configured in /boot/config.txt"
else
    print_error "WM8960 HAT not configured in /boot/config.txt"
    print_warning "Add: dtoverlay=seeed-voicecard"
fi

if grep -q "^dtparam=audio=on" /boot/config.txt; then
    print_error "Onboard audio still enabled - should be disabled"
    print_warning "Comment out: dtparam=audio=on"
else
    print_success "Onboard audio properly disabled"
fi
echo ""

print_status "Checking for PulseAudio..."
if which pulseaudio >/dev/null 2>&1; then
    print_success "PulseAudio installed"
    pulseaudio --version
else
    print_warning "PulseAudio not installed - run setup script to install"
fi
echo ""

print_status "Checking for ALSA configuration..."
if [ -f /etc/asound.conf ]; then
    print_success "ALSA configuration file exists"
    cat /etc/asound.conf
else
    print_warning "No ALSA configuration found - may need to run setup script"
fi
echo ""

# ============================================
# Test 5: Network and Services
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 5: Network and Services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

print_status "Checking system services..."
if systemctl is-active --quiet sshd; then
    print_success "SSH service is running"
else
    print_warning "SSH service not running"
fi

if systemctl is-enabled --quiet pulseaudio.service; then
    print_success "PulseAudio service enabled"
else
    print_warning "PulseAudio service not enabled - may need to run setup script"
fi
echo ""

# ============================================
# Test Summary
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Testing Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Test Summary:"
echo ""
echo "If you saw FAIL messages above:"
echo "  - Check HAT connections"
echo "  - Review /boot/config.txt configuration"
echo "  - Try rebooting the system"
echo "  - Run pi5-setup.sh if not already done"
echo ""
echo "Next steps:"
echo "  1. If tests passed: Run full pi5-setup.sh for Home Assistant"
echo "  2. If tests failed: Check hardware connections"
echo "  3. Reboot if configuration was changed"
echo ""
echo "🏁 All tests completed!"


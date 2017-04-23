# Raspberry Pi Sensors

This is a **Python** package that enables **Raspberry Pi** to read various sensors (and interact with some non-sensors). It has been tested on **Python 2.7**/**Raspbian**.

Supported devices include:
- **DS18B20** temperature sensor
- **BMP180** pressure and temperature sensor
- **HTU21D** humidity and temperature sensor
- **ML8511** UV sensor
- **MCP3004** A/D Converter (**MCP3008** also compatible)
- **LCD1602** and **LCD2004** display

The chief motivation for this package is educational. I am teaching a Raspberry Pi course, and find it very troublesome for students having to download a separate library every time they use another sensor. With this package, download once and they are set (for my course, anyway). I hope you find it useful, too.

## Installation

It is best to update Linux first.

`sudo apt-get update`  
`sudo apt-get upgrade`

Install this package:

`sudo pip install sensor`

But the `sensor` package would not work by itself. Communicating with sensors often requires some sort of serial protocol, such as **1-wire**, **I2C**, or **SPI**. You have to know which sensor speaks which, and set up Linux and Python accordingly.

## Enable 1-Wire

`sudo nano /boot/config.txt`, add this line:
```
dtoverlay=w1-gpio
```
**Reboot.**

## Enable I2C

`sudo apt-get install i2c-tools python-smbus`

`sudo nano /etc/modules`, make sure this line is there:
```
i2c-dev
```

`sudo nano /boot/config.txt`, add this line (or uncomment it):
```
dtparam=i2c_arm=on
```
**Reboot.**

## Enable SPI

`sudo apt-get install python-dev`  
`sudo pip install spidev`

`sudo nano /boot/config.txt`, add this line (or uncomment it):
```
dtparam=spi=on
```
**Reboot.**

## Know your sensor's address

Unlike many libraries out there, this library knows **no default bus number** and **no default device address**. I want learners to be explicitly aware of those numbers, even if they are fixed.

For example:
- **I2C** bus is numbered **1**
- **SPI** bus is numbered **0**

To find out individual sensor's address:
- For 1-wire sensors, go to `/sys/bus/w1/devices/`, and look for a long sequence of numbers
- For I2C sensors, use `i2cdetect -y 1`
- For SPI sensors, you should know which CS pin you use

## My sensors don't give simple numbers

Unlike many libraries out there, this library does not return a simple Celcius degree when reading temperatures, does not return a simple hPa value when reading pressure, does not return a simple RH% when reading humidity, etc. Instead, I return a **namedtuple** representing the quantity, which offers two benefits:

- No more conversion needed. Suppose you get a *Temperature* called `t`, you may access the Celcius degree by `t.C` as easily as you do Fahrenheit by `t.F`.
- Namedtuples may have methods. For example, a *Pressure* has a method called `altitude()`, which tells you how high you are above mean sea level. It is convenient and intuitive.

## DS18B20

- Temperature, 1-wire
- To find out the sensor's address:

    ```
    $ cd /sys/bus/w1/devices/
    $ ls
    28-XXXXXXXXXXXX  w1_bus_master1
    ```

Read the sensor as follows:

```python
from sensor import DS18B20

ds = DS18B20.DS18B20('28-XXXXXXXXXXXX')
t = ds.temperature()  # read temperature

print t    # this is a namedtuple
print t.C  # Celcius
print t.F  # Fahrenheit
print t.K  # Kelvin
```

## BMP180

- Pressure + Temperature, I2C
- Use `i2cdetect -y 1` to check address. It is probably `0x77`.

```python
from sensor import BMP180

# I2C bus=1, Address=0x77
bmp = BMP180.BMP180(1, 0x77)

p = bmp.pressure()  # read pressure
print p             # namedtuple
print p.hPa         # hPa value

t = bmp.temperature()  # read temperature
print t                # namedtuple
print t.C              # Celcius degree

p, t = bmp.all()  # read both at once
print p           # Pressure namedtuple
print t           # Temperature namedtuple

# Look up mean sea level pressure from local observatory.
# 1009.1 hPa is only for example.
a = p.altitude(1009.1)

print a     # Altitude ...
print a.m   # in metre
print a.ft  # in feet
```

## HTU21D

- Humidity + Temperature, I2C
- Use `i2cdetect -y 1` to check address. It is probably `0x40`.

```python
from sensor import HTU21D

# I2C bus=1, Address=0x40
htu = HTU21D.HTU21D(1, 0x40)

h = htu.humidity()  # read humidity
print h             # namedtuple
print h.RH          # relative humidity

t = htu.temperature()  # read temperature
print t                # namedtuple
print t.F              # Fahrenheit

h, t = htu.all()  # read both at once
```

## ML8511

- UV intensity, Analog output
- Cannot interface with Pi directly. Must do so via an A/D converter, e.g. **MCP3004**.
- Output is expressed in **mW/cm<sup>2</sup>** (milli-Watt per cm<sup>2</sup>), and cannot be translated into a UV index simply.

```python
# another style of import
from sensor.ML8511 import ML8511
from sensor.MCP3004 import MCP3004

# A/D converter
# SPI bus=0, CS=0, V_ref=3.3V
mcp = MCP3004(0, 0, 3.3)

# analog output -> channel 0 on MCP3004
ml = ML8511(mcp, 0)

uv = ml.uv()  # read UV intensity

print uv         # namedtuple
print uv.mW_cm2  # mW/cm2
```

## LCD1602, LCD2004

- Not a sensor, obviously. Useful for displaying sensor data.
- Use `i2cdetect -y 1` to check address. It is probably `0x27`.
- Both are used the same way. Just supply the correct class name, as below.

```python
from sensor.LCD1602 import LCD1602

# I2C bus=1, Address=0x27
lcd = LCD1602(1, 0x27)

lcd.display('Nick Lee', 1)   # show my name on line 1
lcd.display('Hong Kong', 2)  # show my city on line 2

lcd.clear()
```

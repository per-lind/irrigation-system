import i18next from 'i18next';

i18next
  .init({
    interpolation: {
      escapeValue: false
    },
    lng: 'en',
    resources: {
      en: {
        translation: {
          methods: {
            StartPump1: 'Pump no 1',
            StartPump2: 'Pump no 2',
            StartPump3: 'Pump no 3',
            TogglePow1: 'Pow 1',
            GetDistance: 'Get water level',
          },
          headers: {
            pumps: 'Pumps'
          },
          actions: {
            button: {
              StartPump1: 'Relay 1',
              StartPump2: 'Relay 2',
              StartPump3: 'Relay 3',
              TogglePow1: 'Pow 1',
              GetDistance: 'Get water level',
            },
            result: {
              StartPump1: 'Relay 1',
              StartPump2: 'Relay 2',
              StartPump3: 'Relay 3',
              TogglePow1: 'Pow 1',
              GetDistance: 'Tank water level',
            }
          },
          getTodaysImage: "Get today's image",
          imageMissing: 'No image',
          graph: {
            light: 'Light',
            light_analog: 'Light analog',
            temperature_BMP085: 'Temperature (BMP085)',
            temperature_AM2320: 'Temperature (AM2320)',
            temperature_analog: 'Temperature (analog)',
            humidity: 'Humidity',
            sealevelpressure: 'Sealevel pressure',
          }
        }
      }
    }
  })

export default i18next;

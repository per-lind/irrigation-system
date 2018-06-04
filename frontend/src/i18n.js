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
          actions: {
            button: {
              ToggleRelay1: 'Relay 1',
              ToggleRelay2: 'Relay 2',
              ToggleRelay3: 'Relay 3',
              TogglePow1: 'Pow 1',
              getDistance: 'Get water level',
            },
            result: {
              ToggleRelay1: 'Relay 1',
              ToggleRelay2: 'Relay 2',
              ToggleRelay3: 'Relay 3',
              TogglePow1: 'Pow 1',
              getDistance: 'Tank water level',
            }
          },
          getImage: 'Get image',
        }
      }
    }
  })

export default i18next;

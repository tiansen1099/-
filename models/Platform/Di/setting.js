import defaultSettings from '../../../defaultSettings';

export default {
  namespace: 'setting',

  state: defaultSettings,

  reducers: {
    getSetting(state) {
      const setting = {};
      const urlParams = new URL(window.location.href);
      Object.keys(state).forEach(key => {
        if (urlParams.searchParams.has(key)) {
          const value = urlParams.searchParams.get(key);
          setting[key] = value === '1' ? true : value;
        }
      });
      return {
        ...state,
        ...setting,
      };
    },

    changeSetting(state, { payload }) {
      const urlParams = new URL(window.location.href);
      Object.keys(defaultSettings).forEach(key => {
        if (urlParams.searchParams.has(key)) {
          urlParams.searchParams.delete(key);
        }
      });
      Object.keys(payload).forEach(key => {
        if (key === 'collapse') {
          return;
        }
        let value = payload[key];
        if (value === true) {
          value = 1;
        }
        if (defaultSettings[key] !== value) {
          urlParams.searchParams.set(key, value);
        }
      });
      const { contentWidth } = payload;
      if (state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }
      window.history.replaceState(null, 'setting', urlParams.href);
      return {
        ...state,
        ...payload,
      };
    },
  },
};

import configCommon from './common.json';
import configDevelopment from './development.json'

const config = { ...configCommon, ...configDevelopment};
export default config;

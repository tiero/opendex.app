import Navigation from './navigation';
import { generateKeys } from './keys';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const randomBytes = size => {
  const bytes = Buffer.allocUnsafe(size);
  global.crypto.getRandomValues(bytes);

  return bytes;
};

const navigation = new Navigation(history);

export { navigation, randomBytes, generateKeys };

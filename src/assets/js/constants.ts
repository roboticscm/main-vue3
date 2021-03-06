export class Token {
  static TOKEN_KEY = 'sessionId';
  static BLOWFISH_ENCRYPTION_KEY = '12345678910';
}

export class API {
  static HOST_URL = 'http://localhost:8182';
  // static HOST_URL = 'http://172.16.30.12:8182';
  // static HOST_URL = 'http://192.168.10.3:8182';

  static BASE_URL = `${API.HOST_URL}/api/`;
}

export class Proxy {
  // static HOST_URL = '172.26.22.61:8200';

  static HOST_URL = 'localhost:8081';
}

export class Net {
  static PROTOCOL = 'http';
}

export const GUTTER_WIDTH = 10; //pixel

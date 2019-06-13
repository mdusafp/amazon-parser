import $ from 'cheerio';
import axios from 'axios';

const httpProvider = axios.create({
  baseURL: 'https://amazon.com',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Mobile Safari/537.36',
    cookie: 'session-id=141-8517505-0468017; session-id-time=2082787201l; ubid-main=135-0997524-4780428; x-wl-uid=1bke/Njm6HYLl6hEIdb9aocZpw9SlisfFbci0KgT+x8tAXk4xeBBugKVXkMJwJf3C+e1xNt31ymQ=; aws-priv=eyJ2IjoxLCJldSI6MCwic3QiOjB9; aws-target-static-id=1547158251432-55798; aws-target-visitor-id=1547158251438-763489; aws-target-data=%7B%22support%22%3A%221%22%7D; s_fid=5D0E9506445F0CDA-36F40168A1764685; regStatus=pre-register; aws-ubid-main=985-2618055-1745275; i18n-prefs=USD; ubid-acbus=130-1946046-8688219; skin=noskin; sp-cdn="L5Z9:RU"; aws-mkto-trk=id%3A112-TZM-766%26token%3A_mch-aws.amazon.com-1547158252263-16993; c_m=undefinedwww.google.comSearch%20Engine; s_cc=true; aws_lang=en; s_dslv=1559540319159; s_vn=1578694251675%26vn%3D7; s_nr=1559540319164-Repeat; session-token=SOvjZWAgsZcaTCdbSms7KaJVJ2yqHnC9uxQ3JD0X8EGt7Yw6nEP+lhELKuk6GBhIdBUoKHrcuU4fwIVrINEAhwn6AHSiXvRgago9pavpnZudPebd+ezaTysknjN7GBr/QeQQ5tU0k9C2hoQvYU1fHzEVOK+rbGds+Zd5tiQoofEAa3+qYJm5JprxdDaz9lTN; csm-hit=adb:adblk_yes&t:1560464652156&tb:s-V0FYX07T6MKANREV1GEC|1560464651143',

  },
  transformResponse: data => $.load(data),
});

export default httpProvider;

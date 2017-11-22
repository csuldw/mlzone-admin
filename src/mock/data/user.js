import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://avatars2.githubusercontent.com/u/12168831?s=400&u=386a38a3e437e0d26e4317ff24c9cb471e357d79&v=4',
    name: '拾毅者'
  }
];

const Users = [];

for (let i = 0; i < 12; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    addr: Mock.mock('@county(true)'),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1)
  }));
}

export { LoginUsers, Users };

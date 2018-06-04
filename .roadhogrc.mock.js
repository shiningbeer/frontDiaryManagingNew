import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';


// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'POST /api/target/get':[
    { 
      name:'人走烟灭',
      createdby:'ff',
      des:'来源于http://ipblock.chacuo.net/',
      ipRange:['192.168.0.0-192.168.255.255','192.167.0.0-192.167.255.255'],
      usedCount:8,
      ipTotal:6555,
      shared:true,
    },
    
    { 
      name:'行尸走肉',
      createdby:'ff',
      des:'来源于http://ipblock.chacuo.net/',
      ipRange:['192.168.0.0-192.168.255.255','192.167.0.0-192.167.255.255'] ,
      usedCount:8,
      ipTotal:6555,
      shared:true,
    },
    { 
      name:'金蝉脱壳',
      createdby:'ff',
      des:'',
      ipRange:['192.168.0.0-192.168.255.255','192.167.0.0-192.167.255.255'] ,
      usedCount:8,
      ipTotal:6555,
      shared:true,
    },
    { 
      name:'兵临城下',
      createdby:'ff',
      des:'来源于http://ipblock.chacuo.net/',
      ipRange:['192.168.0.0-192.168.255.255','192.167.0.0-192.167.255.255'] ,
      usedCount:8,
      ipTotal:6555,
      shared:true,
    },
    
    
    ], 
  'POST /api/plugin/get':[
    { 
      name:'猫的巴士',
      user:'admin',
      des:'猫如果有一辆巴士的话',
      usedCount:8,
      uploadAt: new Date('2017-07-24'),   
    },
    
    { 
      name:'比爱杀耐特',
      user:'admin',
      des:'',
      usedCount:8,
      uploadAt: new Date('2017-07-24'),  
    },
    { 
      name:'可爱巴士',
      user:'admin',
      des:'猫如果有一辆巴士的话',
      usedCount:8,
      uploadAt: new Date('2017-07-24'),  
    },
    { 
      name:'爱死七',
      user:'ff',
      des:'猫如果有一辆巴士的话',
      usedCount:8,
      uploadAt: new Date('2017-07-24'),  
    },
    
    
    ], 

    'POST /api/task/add': (req, res) => {
      res.send({ message: 'Ok',task:req.body.newTask });
    },

    'POST /api/task/get':[
      {
        _id: 'xxx1',
        name: '米之比爱杀耐特',
        description: '',
        createdAt: new Date(),
        user:'ppp',
        percent:2,
        status:'exception'
      },
      {
        _id: 'xxx1',
        name: '引猛之爱死七',
        description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
        createdAt: new Date('2017-07-24'),   
        user:'aaa',     
        percent:40,
        status:'normal'
      },
      {
        _id: 'xxx1',
        name: '太被之奥尔',
        description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
        createdAt: new Date(),
        user:'ppp',
        percent:90,
        status:'normal'
      },
      {
        _id: 'xxx1',
        name: '太高之奥尔',
        description: '那时候我只会想自己想要什么，从不想自己拥有什么',
        createdAt: new Date('2017-07-23'),
        user:'ppp',
        percent:88,
        status:'normal'
      },
      {
        _id: 'xxx1',
        name: '引之奥尔',
        description: '凛冬将至',
        createdAt: new Date('2017-07-23'),
        user:'ppp',
        percent:100,
        status:'success'
      },
      {
        _id: 'xxx1',
        name: '月亮之比爱斯耐特',
        description: '生命就像一盒巧克力，结果往往出人意料',
        createdAt: new Date('2017-07-23'),
        user:'ppp',
        percent:77,
        status:'exception'
      },
    ],
    'POST /api/node/get':[
      { 
        name:'节点1',
        user:'admin',
        url:'http://ipblock.chacuo.net/',
        des:'猫如果有一辆巴士的话',
        ipLeft:8,
        createdAt: new Date('2017-07-24'),   
      },
      
      { 
        name:'节点2',
        user:'admin',
        url:'http://ipblock.chacuo.net/',
        des:'',
        ipLeft:8,
        createdAt: new Date('2017-07-24'),  
      },
      { 
        name:'节点3',
        user:'admin',
        url:'http://ipblock.chacuo.net/',
        des:'猫如果有一辆巴士的话',
        ipLeft:8,
        createdAt: new Date('2017-07-24'),  
      },
      { 
        name:'节点4',
        user:'admin',
        url:'http://ipblock.chacuo.net/',
        des:'猫如果有一辆巴士的话',
        ipLeft:8,
        createdAt: new Date('2017-07-24'),  
      },
      
      
      ], 
    'POST /api/usermgr/get':[

      { 
        name:'用户1',
        authority:'admin',
        pw:'xxx',
        taskCount:8,
        lastLoginAt: new Date('2017-07-24'),
        lastLoginIp:'21.34.56.78'
      },
      { 
        name:'用户2',
        authority:'user',
        pw:'xxx',
        taskCount:8,
        lastLoginAt: new Date('2017-07-24'),   
        lastLoginIp:'21.34.56.78'
      },
      { 
        name:'用户3',
        authority:'user',
        pw:'xxx',
        taskCount:8,
        lastLoginAt: new Date('2017-07-24'),   
        lastLoginIp:'21.34.56.78'
      },
      { 
        name:'用户4',
        authority:'user',
        pw:'xxx',
        taskCount:8,
        lastLoginAt: new Date('2017-07-24'),   
        lastLoginIp:'21.34.56.78'
      },
      { 
        name:'用户5',
        authority:'admin',
        pw:'xxx',
        taskCount:8,
        lastLoginAt: new Date('2017-07-24'),   
        lastLoginIp:'21.34.56.78'
      },
      
      ], 




















  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if(password === '888888' && userName === 'admin'){
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin'
      });
      return ;
    }
    if(password === '123456' && userName === 'user'){
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user'
      });
      return ;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest'
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      "timestamp": 1513932555104,
      "status": 500,
      "error": "error",
      "message": "error",
      "path": "/base/category/list"
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      "timestamp": 1513932643431,
      "status": 404,
      "error": "Not Found",
      "message": "No message available",
      "path": "/base/category/list/2121212"
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      "timestamp": 1513932555104,
      "status": 403,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      "timestamp": 1513932555104,
      "status": 401,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
};

export default noProxy ? {} : delay(proxy, 1000);
// export default format(proxy);
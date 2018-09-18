var request = require('request'),
    iconv = require('iconv-lite'),
    cheerio = require('cheerio'),
    async = require('async'),
    xlsx = require('node-xlsx'),
    fs = require('fs'),
    dtime = require('time-formater'),
    axios = require('axios'),
    logger = require('log4js');

  //主页数据获取接口
//getGoodList('https://store.nike.com/html-services/gridwallData?country=CN&lang_locale=zh_CN&gridwallPath=n/1j5&pn=1')
class Nike{
    constructor() {
        this.url = 'https://store.nike.com/html-services/gridwallData?country=CN&lang_locale=zh_CN&gridwallPath=n/1j5&pn=1'
        this.LOGD = {
            pagenum:1,   //总分页数
            allnum:1,    //总数据
            realnum:1,   //可识别数据
        }
        this.arr = []    
        this.goodList = []
        this.getGoodList.bind(this)
        this.getGoodList(this.url)
    }
  //获取某页数据
    getGoodList(url){
    let promise = new Promise((resolve,reject) => {
      setTimeout((url) => {
        axios.get(url).then((response) => {
          //获取该分页商品个数
          logger.getLogger('collect').info('--获取分页数据--'+(this.LOGD.pagenum++)+'--'+url);
          var body = response.data.sections[0].items;
          //存储每页商品信息
          body.forEach((item,index) => {
              this.goodList.push(item.pdpUrl)
          })
          
          //解析下个分页
          if(response.data.nextPageDataService){
            // this.arr.push(this.getGoodList('https://store.nike.com'+response.data.nextPageDataService));
            
            this.getGoodList('https://store.nike.com'+response.data.nextPageDataService)
          }else {
          //开始获取物品
            this.goodList.forEach((item,index)=>{
              this.getGoodInfo(item,index)
            })
          }
          resolve();
        }).catch((error) => {
          logger.getLogger('error').error('--获取分页数据失败--'+(this.LOGD.pagenum)+'--'+url);
        })
      }, 1000, url);
    });
    return promise;
    }
    getGoodInfo(url,i){
    // let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        axios.get(url).then((response) => {
          var body = response.data;
          var $ = cheerio.load(body);
          var tempData = $.html()
          //找到INITIAL_REDUX_STATE 变量
          if(tempData.indexOf('INITIAL_REDUX_STATE') != -1){
            const tempStart = tempData.indexOf('{',tempData.indexOf('INITIAL_REDUX_STATE'))
            var tempEnd = tempData.indexOf('</script>',tempStart)
            var tempQ = tempData[tempEnd]
            while(tempQ != '}'){
              tempEnd--
              tempQ = tempData[tempEnd]
              // console.log(tempQ,tempEnd)
            }
            logger.getLogger('collect').info('--得到一个可以解析商品信息--'+(this.LOGD.allnum++)+','+(this.LOGD.realnum++));
            // console.log(tempData.substr(tempStart,tempEnd-tempStart+1))
            var tempJson = JSON.parse(tempData.substr(tempStart,tempEnd-tempStart+1))
            
          }else {
            logger.getLogger('collect').warn('--得到一个无法解析商品信息--'+(this.LOGD.allnum)+','+(this.LOGD.realnum++)+','+url);
          }
          // console.log(tempJson)
          // console.log(tempJson.Threads)
          
          // if(goodList[i+1]){
          //   getGoodInfo(goodList[i+1],i+1)
          // }
          // var object = {color : '',style : '',currentp : '',initialp : ''};
          // $('#RightRail').find('li').each(function (item) {
          //   var need = $(this).text(),
          //       length = need.length;
          //   if ($(this).hasClass('description-preview__color-description ncss-li')) {
          //     need = need.substr(need.indexOf('：') + 1, length);
          //     object.color = need;
          //   }
          //   if ($(this).hasClass('description-preview__style-color ncss-li')) {
          //     need = need.substr(need.indexOf('：') + 1, length);
          //     object.style = need;
          //   }
            
          // });
          // object.currentp = currentp;
          // object.initialp = initialp;
          // console.log(url);
          // console.log(object);
          // resolve(object);  
        }).catch((error) => {
          console.log('getOne error', error);
          
        })
      },i*2000);
    // });
    // return promise;
  }
    findData(name, category, diffColor) {
    var fnArr = [],
        items = [];
    for (var j = 0, lg = diffColor.length; j < lg; j++) {
      var currentp = diffColor[j].overriddenEmployeePrice || '',
          initialp = diffColor[j].overriddenLocalPrice || '',
          url = diffColor[j].pdpUrl;
      fnArr.push(getOne(url, j,currentp,initialp));
    }
   Promise.all(fnArr).then((result) => {
    var itmes = [];
    (typeof result) == 'object' ? items[0] = result  : items = result;
    goodList.push({
       name: name,
       category: category,
       items: items
     });
   }).catch((error) => {
     console.log('getOne Promise.all Error', error);
   })
  }
    getOne(url, j, currentp, initialp) {
    let promise = new Promise((resolve, reject) => {
      setTimeout((url, currentp, initialp) => {
        axios.get(url, {
          params: {
            'Referer': 'https://store.nike.com/cn/zh_cn/?cp=cnns_sz_071516_a_ALNUL_bz01&utm_source=Bd&utm_medium=Pcbz&utm_content=title&ipp=120',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
            'X-DevTools-Emulate-Network-Conditions-Client-Id': 'C99558AC7C5C4E00F34F2D9E40875EB6'
          }
        }).then((response) => {
          console.log('getOne succeed');
          var body = response.data;
          var $ = cheerio.load(body);
          var object = {color : '',style : '',currentp : '',initialp : ''};
          $('#RightRail').find('li').each(function (item) {
            var need = $(this).text(),
                length = need.length;
            if ($(this).hasClass('description-preview__color-description ncss-li')) {
              need = need.substr(need.indexOf('：') + 1, length);
              object.color = need;
            }
            if ($(this).hasClass('description-preview__style-color ncss-li')) {
              need = need.substr(need.indexOf('：') + 1, length);
              object.style = need;
            }
            
          });
          object.currentp = currentp;
          object.initialp = initialp;
          console.log(url);
          console.log(object);
          resolve(object);  
        }).catch((error) => {
          console.log('getOne error', error);
          reject();
        })
      }, (j+1) * 20000, url,currentp,initialp);
    });
    return promise;
  }
}
export default Nike
  
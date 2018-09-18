'use strict';
import WeatherModel from '../models/collect/weather'
import PriceModel from '../models/collect/price'
import dtime from 'time-formater'
class Data {
	constructor(){
		
    }
    async getPrice(req, res, next) {
        console.log(req,res);
        // console.log(req.query)
        const {
            name,place,fromDate,toDate
        } = req.query
       
        try {
            var temp = {}
            if(name){
                temp.name = name
            }
            if(place){
                temp.place = place
            }
            if(fromDate && toDate){
                temp.date = {$gte:dtime(fromDate).format('YYYY-MM-DD'),$lte:dtime(toDate).format('YYYY-MM-DD')}
            }
            
            const result = await PriceModel.find(temp)
            // console.log(result)
            res.send({
                status: 1,
                data: result
            })
        } catch (err) {

            res.send({
                status: 0,
                type: 'ERROR',
                message: '接口调用错误',
            })
            return
        }

    }
	async getWeather(req, res, next){
        console.log(req.query)
        const {date} = req.query
        console.log(date)
        if (!date) {
            res.send({
                status: 0,
                type: 'FORM_DATA_ERROR',
                message: '信息错误'
            })
            return
        }
		
        try{
            const result = await WeatherModel.find({'date':date}).populate('city')
            console.log(result)
            res.send({
                status:1,
                data:result
            })
        }catch(err){
            
            res.send({
                status: 0,
                type: 'ERROR',
                message: '接口调用错误',
            })
            return
        }

    }
}

export default new Data()
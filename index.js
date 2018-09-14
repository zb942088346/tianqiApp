let citys

$.ajax({
    url:"https://www.toutiao.com/stream/widget/local_weather/city/",
    type:"get",
    dataType:"jsonp",
    success:function(e){
        citys=e.data;
        
        let str=""
        for(key in citys){
            str+=`<h2>${key}</h2>`
            str+=`<div class="con">`
            for(key2 in citys[key]){
                str+=`<div class="city">${key2}</div>`
            }
            str+="</div>"
        }
        $(str).appendTo($(".citybox"))
    }
    
})
$(function(){
    let cityBox=$(".citybox");
    $("header").click(function(){
        cityBox.slideDown();
    })
    $(".seacher .button").click(function(){
        cityBox.slideUp();
    })


    cityBox.on("touchstart",function(event){
        if(event.target.className=="city"){
            $("header span").text(event.target.innerText);
            cityBox.slideUp(); 
        }
        let weather
        let city=event.target.innerText
        $.ajax({
            url:`https://www.toutiao.com/stream/widget/local_weather/data/?city=${city}`,
            data:{"city":city},
            type:"get",
            dataType:"jsonp",
            success:function(e){
                weather=e.data.weather;
                console.log(weather);
                updata(weather);

            }
        })
          
    })

//默认城市
$.ajax({
    url:`https://www.toutiao.com/stream/widget/local_weather/data/?city=city`,
    data:{"city":"西安"},
    type:"get",
    dataType:"jsonp",
    success:function(e){
        updata(e.data.weather);
     }
})    
function updata(data){
            $("header span").text(data.city_name);
            $(".aqi span").eq(0).text(data.aqi);
            $(".aqi span").eq(1).text(data.quality_level);
            $(".screen h3 span").text(data.current_temperature);
            $(".screen h4 span").text(data.dat_condition);
            $(".screen h5 span").eq(0).text(data.wind_direction);
            $(".screen h5 span").eq(1).text(data.wind_level);
            $(".today span").eq(1).text(data.dat_high_temperature);
            $(".today span").eq(2).text(data.dat_low_temperature);
            $(".today span").eq(3).text(data.dat_condition);
            $(".tomorrow span").eq(1).text(data.tomorrow_high_temperature);
            $(".tomorrow span").eq(2).text(data.tomorrow_low_temperature);   
            $(".tomorrow span").eq(3).text(data.dat_condition);
            $(".today span img").attr("src",`img/${data.dat_weather_icon_id}.png`);
            $(".tomorrow span img").attr("src",`img/${data.dat_weather_icon_id}.png`);

            //小时
            let str2=""
            for(obj of data.hourly_forecast){
            str2+=`
            <div class="box">
                <div><span>${obj.hour}</span>:00</div>
            <img src="img/${obj.weather_icon_id}.png" alt="">
                <div><span>${obj.temperature}</span>°</div>
            </div>`

            }
            $(".hours .con").html(str2);

                //获取每天
            let str1=""
            let week=['日','一','二','三','四','五','六'];
            let height=[];
            let low=[];
            let x=[];
            for(obj of data.forecast_list){
            let date=new Date(obj.date);
            let day=date.getDay();
            height.push(obj.high_temperature);
            low.push(obj.low_temperature);
            x.push(obj.date);
            str1+=`
                <li>
                    <p class="day1">星期${week[day]}</p>
                    <p class="data">${obj.high_temperature}/${obj.low_temperature}</p>
                    <p class="dayweather">${obj.condition}</p>
                    <img src="img/${obj.weather_icon_id}.png" alt="" class="dayweatherimg">
                    <p class="wind">${obj.wind_direction}</p>
                    <p class="wind"><span>${obj.wind_level}</span>级</p>
                </li>`           
            }
            $(".week ").html(str1);
            
        //线
        var myChart = echarts.init($("#solid")[0]);
        var option = {
            tooltip: {},
            xAxis: {
                show:false,
                data:x,
            },
            yAxis: {
                show:false,
            },
            legend: {
                
                x: 'center',               // 水平安放位置，默认为全图居中，可选为：
                                           // 'center' ¦ 'left' ¦ 'right'
                                           // ¦ {number}（x坐标，单位px）
                y: 'bottom',
            },
            series: [{
                name: '最高温度',
                type: 'line',
                data: height,
                symbol:'circle',
                symbolSize:5,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color:'#333',
                    }
                },
                itemStyle : {
                    normal : {
                        color:'#00FF00',
                        lineStyle:{
                            color:'#00FF00'
                        }
                    }
                },
            },
                {
                name: '最低温度',
                type: 'line',
                symbol:'circle',
                symbolSize:5,
                data:low,
                label: {
                    normal: {
                        show: true,
                        position: 'bottom',
                        color:'#333',
                    }
                },
                itemStyle : {
                    normal : {
                        color:'#52AFE8',
                        lineStyle:{
                            color:'#52AFE8'
                        }
                    }
                },
            },
            ],
            grid:{
                left:0,
                top:0,
                right:0,
                bottom:0,
            },
           
           
    
        };
    
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);          
}
//语音播报
        $(".audioBtn").click(function(event){
            event.stopPropagation();
            let speech=window.speechSynthesis;
            let speechset=new SpeechSynthesisUtterance();
            speechset.rate = 1;

            let text="Bixby为您语音播报"+$("header span").text()+"今天的天气"+"当前温度"+$(".screen h3 span").text()+"摄氏度"+$(".screen h4 span").text()+"祝您一天生活愉快"
            speechset.text=text;
            speech.speak(speechset);
        })

    



})



  
# hegel
hegel is a Data Visualization Service written by node.js and d3.js. It renders png image when you post data to server.


# todo:
+ 多线条绘图接口
+ 美化现有line chart图
+ 坐标可增加轴标题
+ 自定义纵横坐标轴接口
+ 增加折线图、饼状图、柱形图接口

# how to use

1. `git clone git@github.com:ubear/hegel.git`
2. install node.js
3. `cd hegel & npm install`
4. `node server.js > log.txt`or `nodejs server.js > log.txt`

# post data

The default address is `localhost:3000`, then post data to the `localhost:3000/render/`, and get png picture from `localhost:3000/png/filename.png` or get svg picture from `localhost:3000/svg/filename.svg`.

The data format is `json` and the params is as follow:

```json
{
  "width": "400",
  "height": "200",
  "units": "%", 
  "stokeColor": "green",
  "stokeWidth": 2,
  "filename": "percentage.png",
  "data":[[1445749500.0, 100.0], 
          [1445749800.0, 100.0], 
          [1445750100.0, 100.0], 
          [1445750400.0, 100.0], 
          [1445750700.0, 100.0],
          [1445751000.0, 100.0]
        ]
}

```

# result

The png image is like this:

+ ![](http://7q5cly.com1.z0.glb.clouddn.com/hegelgithub73.png)
+ ![](http://7q5cly.com1.z0.glb.clouddn.com/hegelgithub2506.png)
+ ![](http://7q5cly.com1.z0.glb.clouddn.com/hegel1445766000272.png)
+ ![](http://7q5cly.com1.z0.glb.clouddn.com/hegel1445766100377.png)





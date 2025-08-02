# 1. 选择一个基础镜像
# 我们选择一个官方的Node.js镜像，版本为18。
# 你的项目用什么语言和框架，就选择对应的基础镜像。
FROM node:18-alpine

# 2. 设置工作目录
# 在Docker容器（未来的小电脑）里创建一个叫'/app'的文件夹，并进入这个文件夹
WORKDIR /app

# 3. 复制项目文件
# 把你本地的package.json和package-lock.json文件复制到容器的/app文件夹里
# 'COPY'左边是你的电脑里的文件，右边是容器里的路径
COPY package*.json ./

# 4. 安装项目依赖
# 运行npm install命令来安装所有需要的工具包
RUN npm install

# 5. 复制所有代码
# 把backend文件夹里剩下的所有代码都复制到容器的/app文件夹里
COPY . .

# 6. 暴露端口
# 告诉Docker，我们的应用程序会使用4000端口
EXPOSE 4000

# 7. 启动应用
# 当容器启动时，运行'npm start'命令来启动你的程序
# 你需要确保你的package.json里有"start"脚本
CMD ["npm", "start"]

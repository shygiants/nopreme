# Nopreme

![Nopreme logo](resources/img/logo.png)
<img>

***Nopreme*** = ***No*** + ***Prem***ium ([플미](https://dic.daum.net/word/view.do?wordid=kkw000937633&supid=kku011048313): 프리미엄) + ***e***

아티스트에 대한 팬들의 열렬한 마음을 이용해 부당하게 이득을 취하는 일을 근절합니다.

## Getting Started

### Setup DB

See [here](docker/mongo/README.md)

### Setup Server

```bash
# Install dependencies
npm install

# Optional: Update GraphQL schema
npm run update-scema

# Compile Relay
npm run relay

# Pack sources with Parcel
npm run build

# Serve
npm run serve
```

### Configuration

Write `.env` file according to `.env.template`.
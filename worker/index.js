const keys = require('./keys');
const redis = require('redis');

const client = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = client.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  client.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');

console.log("redisHost: ", keys.redisHost)
console.log("redisPort", keys.redisPort)
client.set('hello', "world", (err,res)=>{
  console.log("err:", err)
  console.log("res", res)
})
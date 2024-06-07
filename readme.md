Hi guys! I do some tests:

I create a repository with different transport classes to test the [issue](https://github.com/winstonjs/winston/issues/1250).
- `asyncLogger` is an implementation extending from `winston-transport` class. The transport is executed on the file `notWorking.js` using winston logger.
- `asyncStream` is an implementation extending from `stream.Writable` class. The transport is executed on the file `working.js`. The stream is used directly without winston.
- `asyncStreamWinston` is an implementation extending from `stream.Writable` class. The transport is executed on the file `someChunksAreMissing.js`. The stream is used as a transport for winston logger. 
 
If you check each transport class, you will see that the implementation is almost the same.
  
Extending from `winston-transport` class only works if the buffer is less than the highWaterMark value. Otherwise, the program will crash. To make it work, I can remove the `setImmediate` function and call the callback directly.
Extending from `stream.Writable` class and using the same options works as expected even with a callback called inside the `setImmediate` function.
Extending from `stream.Writable` class and using the same options but as a transport for winston logger, the last chunk is missing. The difference with the first scenario
is that I do can call the callback inside the `setImmediate` function but the last chunk is missing.

rm -rf gen-cpp
rm -rf gen-js
rm -rf gen-nodejs

thrift --gen cpp LBN_Thrift.thrift
thrift --gen js LBN_Thrift.thrift
thrift --gen js:jquery LBN_Thrift.thrift
thrift --gen js:node LBN_Thrift.thrift


Search.setIndex({envversion:49,filenames:["api/index","api/jubakit","api/jubakit.loader","architecture/config","architecture/dataset","architecture/index","architecture/loader","architecture/schema","architecture/service","architecture/shell","guide/faq","guide/index","guide/jubamodel","guide/jubash","guide/loader_develop","index","introduction","overview"],objects:{"":{"--cluster":[13,8,1,"cmdoption-jubash--cluster"],"--command":[13,8,1,"cmdoption-jubash--command"],"--debug":[13,8,1,"cmdoption-jubash--debug"],"--engine":[13,8,1,"cmdoption-jubash--engine"],"--fail-fast":[13,8,1,"cmdoption-jubash--fail-fast"],"--fix-header":[12,8,1,"cmdoption-jubamodel--fix-header"],"--help":[13,8,1,"cmdoption-jubash--help"],"--host":[13,8,1,"cmdoption-jubash--host"],"--in-format":[12,8,1,"cmdoption-jubamodel--in-format"],"--keepalive":[13,8,1,"cmdoption-jubash--keepalive"],"--no-validate":[12,8,1,"cmdoption-jubamodel--no-validate"],"--out-format":[12,8,1,"cmdoption-jubamodel--out-format"],"--output":[12,8,1,"cmdoption-jubamodel--output"],"--output-config":[12,8,1,"cmdoption-jubamodel--output-config"],"--port":[13,8,1,"cmdoption-jubash--port"],"--prompt":[13,8,1,"cmdoption-jubash--prompt"],"--service":[13,8,1,"cmdoption-jubash--service"],"--timeout":[13,8,1,"cmdoption-jubash--timeout"],"--verbose":[13,8,1,"cmdoption-jubash--verbose"],"-C":[13,8,1,"cmdoption-jubash-C"],"-F":[13,8,1,"cmdoption-jubash-F"],"-H":[13,8,1,"cmdoption-jubash-H"],"-O":[12,8,1,"cmdoption-jubamodel-O"],"-P":[13,8,1,"cmdoption-jubash-P"],"-c":[13,8,1,"cmdoption-jubash-c"],"-d":[13,8,1,"cmdoption-jubash-d"],"-e":[13,8,1,"cmdoption-jubash-e"],"-f":[12,8,1,"cmdoption-jubamodel-f"],"-h":[13,8,1,"cmdoption-jubash-h"],"-i":[12,8,1,"cmdoption-jubamodel-i"],"-k":[13,8,1,"cmdoption-jubash-k"],"-o":[12,8,1,"cmdoption-jubamodel-o"],"-p":[13,8,1,"cmdoption-jubash-p"],"-s":[13,8,1,"cmdoption-jubash-s"],"-t":[13,8,1,"cmdoption-jubash-t"],"-v":[13,8,1,"cmdoption-jubash-v"],jubakit:[1,0,0,"-"]},"jubakit.anomaly":{Anomaly:[1,1,1,""],Config:[1,1,1,""],Dataset:[1,1,1,""],Schema:[1,1,1,""]},"jubakit.anomaly.Anomaly":{add:[1,2,1,""],calc_score:[1,2,1,""],name:[1,3,1,""],overwrite:[1,2,1,""],update:[1,2,1,""]},"jubakit.anomaly.Config":{methods:[1,3,1,""]},"jubakit.anomaly.Schema":{FLAG:[1,4,1,""],ID:[1,4,1,""],__init__:[1,2,1,""],transform:[1,2,1,""]},"jubakit.base":{BaseConfig:[1,1,1,""],BaseDataset:[1,1,1,""],BaseLoader:[1,1,1,""],BaseSchema:[1,1,1,""],BaseService:[1,1,1,""],GenericConfig:[1,1,1,""],GenericSchema:[1,1,1,""],Utils:[1,1,1,""]},"jubakit.base.BaseConfig":{"default":[1,3,1,""],__init__:[1,2,1,""]},"jubakit.base.BaseDataset":{__init__:[1,2,1,""],convert:[1,2,1,""],get:[1,2,1,""],get_schema:[1,2,1,""],is_static:[1,2,1,""],shuffle:[1,2,1,""]},"jubakit.base.BaseLoader":{is_infinite:[1,2,1,""],preprocess:[1,2,1,""],rows:[1,2,1,""]},"jubakit.base.BaseSchema":{AUTO:[1,4,1,""],IGNORE:[1,4,1,""],INFER:[1,4,1,""],__init__:[1,2,1,""],predict:[1,3,1,""],transform:[1,2,1,""]},"jubakit.base.BaseService":{__init__:[1,2,1,""],clear:[1,2,1,""],get_status:[1,2,1,""],load:[1,2,1,""],name:[1,3,1,""],run:[1,3,1,""],save:[1,2,1,""],shell:[1,2,1,""],stop:[1,2,1,""]},"jubakit.base.GenericConfig":{__init__:[1,2,1,""],add_mecab:[1,2,1,""],clear_converter:[1,2,1,""],methods:[1,3,1,""]},"jubakit.base.GenericSchema":{BINARY:[1,4,1,""],NUMBER:[1,4,1,""],STRING:[1,4,1,""],predict:[1,3,1,""],transform:[1,2,1,""]},"jubakit.base.Utils":{softmax:[1,5,1,""]},"jubakit.classifier":{Classifier:[1,1,1,""],Config:[1,1,1,""],Dataset:[1,1,1,""],Schema:[1,1,1,""]},"jubakit.classifier.Classifier":{classify:[1,2,1,""],name:[1,3,1,""],train:[1,2,1,""],train_and_classify:[1,3,1,""]},"jubakit.classifier.Config":{methods:[1,3,1,""]},"jubakit.classifier.Dataset":{from_array:[1,3,1,""],from_data:[1,3,1,""],from_matrix:[1,3,1,""],get_labels:[1,2,1,""]},"jubakit.classifier.Schema":{LABEL:[1,4,1,""],__init__:[1,2,1,""],transform:[1,2,1,""]},"jubakit.dumb":{Bandit:[1,1,1,""],Burst:[1,1,1,""],Clustering:[1,1,1,""],Graph:[1,1,1,""],NearestNeighbor:[1,1,1,""],Recommender:[1,1,1,""],Regression:[1,1,1,""],Stat:[1,1,1,""]},"jubakit.dumb.Bandit":{CONFIG:[1,4,1,""],name:[1,3,1,""]},"jubakit.dumb.Burst":{CONFIG:[1,4,1,""],name:[1,3,1,""]},"jubakit.dumb.Clustering":{CONFIG:[1,4,1,""],name:[1,3,1,""]},"jubakit.dumb.Graph":{CONFIG:[1,4,1,""],name:[1,3,1,""]},"jubakit.dumb.NearestNeighbor":{CONFIG:[1,4,1,""],name:[1,3,1,""]},"jubakit.dumb.Recommender":{CONFIG:[1,4,1,""],name:[1,3,1,""]},"jubakit.dumb.Regression":{CONFIG:[1,4,1,""],name:[1,3,1,""]},"jubakit.dumb.Stat":{CONFIG:[1,4,1,""],name:[1,3,1,""]},"jubakit.loader":{array:[2,0,0,"-"],chain:[2,0,0,"-"],core:[2,0,0,"-"],csv:[2,0,0,"-"],odbc:[2,0,0,"-"],sparse:[2,0,0,"-"],twitter:[2,0,0,"-"]},"jubakit.loader.array":{ArrayLoader:[2,1,1,""],ZipArrayLoader:[2,1,1,""]},"jubakit.loader.array.ArrayLoader":{__init__:[2,2,1,""],rows:[2,2,1,""]},"jubakit.loader.array.ZipArrayLoader":{__init__:[2,2,1,""],rows:[2,2,1,""]},"jubakit.loader.chain":{ConcatLoader:[2,1,1,""],MergeChainLoader:[2,1,1,""],ValueMapChainLoader:[2,1,1,""]},"jubakit.loader.chain.ConcatLoader":{__init__:[2,2,1,""],rows:[2,2,1,""]},"jubakit.loader.chain.MergeChainLoader":{__init__:[2,2,1,""],rows:[2,2,1,""]},"jubakit.loader.chain.ValueMapChainLoader":{__init__:[2,2,1,""],rows:[2,2,1,""]},"jubakit.loader.core":{LineBasedFileLoader:[2,1,1,""],LineBasedStreamLoader:[2,1,1,""]},"jubakit.loader.core.LineBasedFileLoader":{__init__:[2,2,1,""]},"jubakit.loader.core.LineBasedStreamLoader":{__init__:[2,2,1,""],rows:[2,2,1,""]},"jubakit.loader.csv":{CSVLoader:[2,1,1,""]},"jubakit.loader.csv.CSVLoader":{__init__:[2,2,1,""],rows:[2,2,1,""]},"jubakit.loader.odbc":{ODBCLoader:[2,1,1,""]},"jubakit.loader.sparse":{SparseMatrixLoader:[2,1,1,""]},"jubakit.loader.sparse.SparseMatrixLoader":{__init__:[2,2,1,""],rows:[2,2,1,""]},"jubakit.loader.twitter":{TwitterOAuthHandler:[2,1,1,""],TwitterStreamLoader:[2,1,1,""]},"jubakit.loader.twitter.TwitterOAuthHandler":{__init__:[2,2,1,""],get:[2,2,1,""]},"jubakit.loader.twitter.TwitterStreamLoader":{FILTER:[2,4,1,""],FIREHOSE:[2,4,1,""],SAMPLE:[2,4,1,""],SITE:[2,4,1,""],STATUS_KEYS:[2,4,1,""],USER:[2,4,1,""],__init__:[2,2,1,""],is_infinite:[2,2,1,""],rows:[2,2,1,""]},"jubakit.logger":{get_logger:[1,6,1,""],setup_logger:[1,6,1,""]},"jubakit.model":{InvalidModelFormatError:[1,7,1,""],JubaDump:[1,1,1,""],JubaModel:[1,1,1,""],JubaModelError:[1,7,1,""]},"jubakit.model.JubaDump":{dump:[1,3,1,""],dump_file:[1,3,1,""]},"jubakit.model.JubaModel":{Container:[1,1,1,""],Header:[1,1,1,""],ModelPart:[1,1,1,""],SystemContainer:[1,1,1,""],UserContainer:[1,1,1,""],__init__:[1,2,1,""],data:[1,2,1,""],dump_binary:[1,2,1,""],dump_json:[1,2,1,""],dump_text:[1,2,1,""],fix_header:[1,2,1,""],load_binary:[1,3,1,""],load_json:[1,3,1,""],predict_format:[1,3,1,""]},"jubakit.model.JubaModel.Container":{dump:[1,2,1,""],load:[1,3,1,""]},"jubakit.model.JubaModel.Header":{dump:[1,2,1,""],fields:[1,3,1,""],load:[1,3,1,""]},"jubakit.model.JubaModel.ModelPart":{__init__:[1,2,1,""],dump:[1,2,1,""],dumps:[1,2,1,""],fields:[1,3,1,""],get:[1,2,1,""],load:[1,3,1,""],loads:[1,3,1,""],set:[1,2,1,""]},"jubakit.model.JubaModel.SystemContainer":{fields:[1,3,1,""]},"jubakit.model.JubaModel.UserContainer":{fields:[1,3,1,""]},"jubakit.model.JubaModelError":{__init__:[1,2,1,""]},"jubakit.recommender":{Config:[1,1,1,""],Dataset:[1,1,1,""],Recommender:[1,1,1,""],Schema:[1,1,1,""]},"jubakit.recommender.Config":{methods:[1,3,1,""]},"jubakit.recommender.Recommender":{complete_row_from_datum:[1,2,1,""],complete_row_from_id:[1,2,1,""],decode_row:[1,2,1,""],name:[1,3,1,""],similar_row_from_datum:[1,2,1,""],similar_row_from_id:[1,2,1,""],update_row:[1,2,1,""]},"jubakit.recommender.Schema":{ID:[1,4,1,""],__init__:[1,2,1,""],transform:[1,2,1,""]},"jubakit.shell":{JubaShell:[1,1,1,""],JubaShellAssertionError:[1,7,1,""],JubaShellException:[1,7,1,""],JubaShellRPCError:[1,7,1,""]},"jubakit.shell.JubaShell":{__init__:[1,2,1,""],connect:[1,2,1,""],disconnect:[1,2,1,""],get_cli_classes:[1,3,1,""],get_client:[1,2,1,""],get_client_classes:[1,3,1,""],get_timeout:[1,2,1,""],interact:[1,2,1,""],is_connected:[1,2,1,""],probe_facts:[1,3,1,""],run:[1,2,1,""],set_remote:[1,2,1,""],set_timeout:[1,2,1,""]},"jubakit.shell.JubaShellRPCError":{__init__:[1,2,1,""]},"jubakit.weight":{Config:[1,1,1,""],Dataset:[1,1,1,""],Schema:[1,1,1,""],Weight:[1,1,1,""]},"jubakit.weight.Config":{methods:[1,3,1,""]},"jubakit.weight.Weight":{calc_weight:[1,2,1,""],name:[1,3,1,""],update:[1,2,1,""]},jubakit:{anomaly:[1,0,0,"-"],base:[1,0,0,"-"],classifier:[1,0,0,"-"],compat:[1,0,0,"-"],dumb:[1,0,0,"-"],loader:[2,0,0,"-"],logger:[1,0,0,"-"],model:[1,0,0,"-"],recommender:[1,0,0,"-"],shell:[1,0,0,"-"],weight:[1,0,0,"-"]}},objnames:{"0":["py","module","Python module"],"1":["py","class","Python class"],"2":["py","method","Python method"],"3":["py","classmethod","Python class method"],"4":["py","attribute","Python attribute"],"5":["py","staticmethod","Python static method"],"6":["py","function","Python function"],"7":["py","exception","Python exception"],"8":["std","option","option"]},objtypes:{"0":"py:module","1":"py:class","2":"py:method","3":"py:classmethod","4":"py:attribute","5":"py:staticmethod","6":"py:function","7":"py:exception","8":"std:option"},terms:{"0xdeadbeef":4,"1_9199_classifier_test":12,"1_9199_classifier_test2":12,"402823e":1,"\u306e\u7d39\u4ecb":16,"abstract":[1,4,5],"byte":9,"case":[3,4,9,17],"class":[1,2,3,4,6,8,14],"default":[1,2,3,4,7,8,9,10,12,13,14],"export":10,"float":[9,14],"function":4,"import":[1,3,4,6,7,8,9,10,14,16],"new":[1,2,4,11,13],"return":[1,5,8,14],"static":1,"super":14,"switch":1,"throw":9,"true":[1,2,4,14,16],"while":[9,14,17],__init__:[1,2,14],_client:1,_data:1,_window:14,_window_s:14,abl:4,abov:[4,9],acceler:17,access:[1,2],access_secret:2,access_token:2,actual:1,add:[1,9,14,17],add_mecab:1,addit:[4,8],address:13,advis:14,after:3,alia:1,aliv:13,all:[1,4,7,14],allow:[4,17],almost:9,alreadi:[1,9],also:[3,9,14,17],alter:1,although:[9,14,16],analysi:17,analyz:[5,8],ani:[1,9,12],anomali:0,anomaly_auc:16,anoth:[1,2,4],any:2,app:2,appear:9,appli:[1,4],arg:[1,2,14],argument:[2,4,8,9,14],arow:3,arrai:[0,1],arrayload:2,asctim:1,assign:[1,7,8,17],associ:1,assum:9,assume_unreward:1,auth:2,authent:2,auto:[1,7,12,13],automat:[1,2,3,4,7,8,9,12],avail:[1,8,9],averag:14,avoid:14,awar:7,back:12,backend:1,bandit:1,base:0,baseconfig:1,basedataset:[1,4],baseload:[1,2,14],baseschema:1,baseservic:1,bash:9,basic:7,batch:[1,9],batch_interv:1,becom:[4,7],behavior:[16,17],best:16,better:[1,13],between:7,bigram:[1,3],bin:9,binari:[1,3,7,9,12],binary:[1,7],binary_rul:3,binary_typ:3,binary_valu:[1,4],both:4,brief:[5,9],briefli:9,bucket_s:1,build:1,built:[10,14],bulk:[1,4,9,16],bundl:6,burst:1,calc_scor:1,calc_weight:1,calcul:[1,14],call:[1,3,4,5,8,9,13,14,17],callabl:1,can:[1,2,3,4,6,7,8,9,10,12,14,16,17],cannot:[1,4],cast:7,cfg:[3,8],chain:[0,1],char_num:[1,3],checksum:[1,12],child:1,classifi:0,classifier_bulk:16,classifier_csv:16,classifier_digit:16,classifier_hyperopt_tun:16,classifier_kfold:16,classifier_libsvm:16,classifier_paramet:16,classifier_servic:8,classifier_shogun:16,classifier_twitt:16,classmethod:1,clear:[1,3,8,9],clear_convert:[1,3],cli:1,client:[1,9,13],close:[1,2],cluster:[1,8,13],code:[4,9,10,17],column:[2,4,7,14,16],com:2,come:17,command:[1,5],common:[4,9],commonli:14,commun:[5,9,13],compat:0,complet:1,complete_row_from_datum:1,complete_row_from_id:1,compon:5,compressor_method:1,compressor_paramet:1,concat:2,concatload:2,conceal:17,config:1,configur:[1,3,8,12,17],conflict:8,confus:14,conjunct:16,connect:[1,8,9,13],consid:14,consist:[3,5,9],construct:4,constructor:14,consumer_kei:2,consumer_secret:2,contain:[1,14],content:[3,13],control:9,conveni:[1,3,4,7],convert:[1,3,4,12],copi:1,core:[0,1],correspond:[1,6,9],costcut_threshold:1,count:2,cp932:2,crc32:12,creat:[1,2,3,4,8,14],cross:[1,4,16],cross_valid:4,csv:[0,1],csvloader:[2,6,7,16,17],current:[1,4,8,16],custom:[1,9,17],cycl:17,damping_factor:1,data:[1,2],data_typ:1,dataset2:4,dataset:[1,2],datum:[1,4,5,7,9,13],datum_kei:9,datum_valu:9,debug:[10,13],decode_row:1,def:14,default_valu:1,defin:[1,3,4,5,7,9,16],delete_label:9,delimit:2,deprec:13,descript:[2,7,9,11],design:9,destructor:8,detail:[3,6,12,13,16,17],detect:[9,13,16,17],develop:[6,11],dict:[1,3,6,14],dictread:2,differ:[1,7],digit:16,dimension:14,direct:2,directli:1,directori:16,disabl:[12,13],discard:[1,7],disconnect:1,discourag:1,displai:13,distribut:1,do_mix:9,document:[12,16],doe:[1,8,14],don:[4,13,17],done:9,ds_test:4,ds_train:4,due:9,dumb:0,dummi:14,dump:1,dump_binari:1,dump_fil:1,dump_json:1,dump_text:1,each:[1,2,5,6,7,8,9,13,14,16],easili:[4,9,14,16,17],emit:14,empti:1,enabl:[10,13],encod:2,engin:[1,13,16],ent:[1,14],entri:[1,2,14],environ:[1,10],environmenet:2,equival:[9,13],error:13,establish:[1,13],estim:[7,16],etc:[1,2,5,6,13,17],eth0:9,euclid_lsh:3,eval:9,evalu:16,even:[3,6,8,14],everi:7,everyth:4,exampl:[2,4,5,6,7,8,9,11],except:1,exception:1,exclude_featur:1,execut:9,exist:[1,9,11],exit:9,expect:[1,2,9],explicitli:14,express:9,exsit:1,extend:[6,11],extens:14,extern:8,extract:[1,3,12],fail:13,fallback:1,fallback_typ:4,fals:[1,2,4,14],fast:13,fatal:13,favorite_count:2,favourites_count:2,featur:1,feature_nam:[1,2],femal:[6,9],fetch:[5,6],field:[1,2],fieldnam:2,file:[1,2,3,5,6,7,12,14,16,17],filenam:[1,2],filter:[2,11],find:16,firehos:2,firehose:2,first:[2,4],fix:12,fix_head:1,flag:[1,7],flat:[1,14],focu:[8,17],fold:16,follow:[2,3,4,6,7,8,9,10,14,16],followers_count:2,format:[1,5,12,13,16],friendli:12,friends_count:2,from:[1,2,3,4,5,6,7,8],from_arrai:[1,4],from_data:1,from_matrix:[1,4],func:1,fundament:1,fv_convert:16,gender:[6,7],gener:[1,2,4,8,13],genericconfig:1,genericschema:1,get:[1,2,4,16],get_cli_class:1,get_client:1,get_client_class:1,get_config:9,get_label:[1,9],get_logg:1,get_proxy_statu:9,get_schema:[1,4],get_statu:[1,8,9],get_timeout:1,give:[2,7],given:[1,4,9],global_weight:[1,3],goal:17,got:8,graph:1,graph_wo_index:1,ground:[5,7],guess:1,guid:6,handi:9,handl:[1,2,9,16],hash_num:[1,3],have:[1,2,7,8,13,14,17],header:[1,12],height:9,hello:4,help:[9,12,13],here:[3,5,14,17],high:[1,12],hold:14,host:[1,13],how:[4,9,10,16],howev:7,http:2,human:1,hyper:[3,16],hyperopt:16,id_str:2,identifi:7,idf:[1,3],idx:[1,16],ifconfig:9,ignor:[1,2,7],ignore:[1,7],illustr:9,immed:1,immut:1,implement:[1,4,6,11],in_format:12,includ:12,include_featur:1,independ:12,indetermin:1,index:[1,4],indic:[12,13],infer:[1,7],infinit:[1,4,14],infiniterandomload:14,inform:[2,4],inherit:[3,14],initial:1,input:[7,12],instal:[1,2,16],install:15,instanc:[1,3,4,8,9],instead:[4,12,13],integr:[9,17],intend:[1,7,9],interact:[1,5,9,13],interest:7,interfac:[1,5,9,13,17],intern:1,interpret:9,invalidmodelformaterror:1,inverted_index:1,invoc:17,iri:16,is_connect:1,is_infinit:[1,2,14],is_proxi:1,is_stat:1,item:16,iter:4,jane:6,japanes:12,john:6,json:[1,3,9,12,14],jsonl:14,jsonlload:14,jubaanomali:9,jubaclassifi:[8,9,13,16],jubadump:[1,12],jubakit:0,jubakit_log_level:10,jubamodel:[1,11],jubamodelerror:1,jubashel:1,jubashellassertionerror:1,jubashellexcept:1,jubashellrpcerror:1,jubatu:[1,3,4,5],just:[1,2,7,14],keep:13,keepal:[9,13],kei:[1,2,3,4,5,6,7,9],keyword:2,kfold:4,kind:[1,14],kmaehashi:16,kmean:1,know:7,known:9,kwarg:[1,2,14],label:[1,5,7,9,16],label_nam:1,labeleddatum:9,lambda:4,landmark_num:1,lang:2,larg:1,last:14,launch:8,learn:1,least:14,len:[4,14],length:[1,2],level:[1,12],levelnam:1,libsvm:16,licens:15,like:[1,2,4,6,7,9,10,14,16],line:[2,5,6],linebasedfileload:[2,14],linebasedstreamload:2,list:[1,2,4],listed_count:2,load:[1,2,4,5,6,7,8,9,12,14,16],load_binari:1,load_json:1,loader:[0,1],local:[1,9],local_sensit:3,localhost:9,locat:1,lof:1,log:[1,8,10],log_format:1,logger:0,loop:9,low:[1,12],lsh:1,machin:1,mai:[1,4,7],mainli:1,make:[1,5,8,13,14],male:[6,9],manag:8,mandatori:[12,14,16],mani:7,manipul:[1,12],manual:[7,9,12],map:[1,2],mari:6,matrix:[1,2,6],max_reuse_batch_num:1,mean:7,mecab:1,member:1,memori:[1,4,14],mention:4,merg:2,mergechainload:2,messag:[1,2],meta:12,method:[1,2,3,4,9,14],metric:[1,16],minimum:14,miss:1,mit:16,mode:[1,2,8,9,13],model:0,model_fil:12,modelpart:1,modifi:[1,3,4,12],modul:0,monitor:9,most:[3,4,17],move:14,movingaverageload:14,msg:1,multipl:[2,7,9],must:[1,2,4,5,7,9,13,14],my_clust:8,n0e:9,n_featur:1,n_fold:4,n_label:1,n_sampl:1,name:[1,2,6],named_arrai:2,nearest_neighbor:[1,13],nearest_neighbor_num:3,nearestneighbor:1,necessari:17,need:[1,4,9,14,16],next:9,ngram:[1,3],nherd:3,nic:9,non:1,none:[1,2,4,14],note:[1,4,5,7,9,12,13,14],noth:14,now:[9,14],num:[1,3],num_filter_rul:[1,3],num_filter_typ:[1,3],num_rul:[1,3],num_typ:[1,3],num_valu:[1,4],number:[1,4,7,9,13,14,16,17],numer:[1,3,4,5,7,16],numpi:6,object:[1,2,3,4,6,14],occur:13,odbc:[0,1],odbcloader:2,odd:14,oddlineload:14,off:10,onc:7,once:[8,12],ongo:8,onli:[2,3,4,7,9,14,17],open:1,oper:[4,14],option:[1,2,4,9,11],optional:1,order:4,orient:2,other:[2,4,6,7,8,9,12],otherwis:1,out:[8,12],out_format:12,output:[6,12,14],output_config:12,outsid:9,over:[4,14],overrid:[1,2,14],overview:15,overwrit:1,own:[1,6,14],pa1:1,packag:0,packet:9,paramet:1,part:[1,7,14],pass:[2,7,16],path:[1,6,12],per:14,perform:[1,12,13,14,16,17],period:9,perl:9,pick:8,pickl:4,pip:16,plain:6,pleas:[4,14],point:[1,14],port:[1,8,9,13,17],power:[16,17],pre:1,precis:1,predict:1,predict_format:1,preprocess:[1,2,14],print:[1,3,4,6,9,14,16,17],probe:1,probe_fact:1,process:[1,2,3,4],profil:7,program:9,prompt:[9,13],property_nam:1,provid:[1,4,5,8,9,13,14,17],proxi:13,pull:14,push:1,python:[6,9,16,17],queri:9,quick:[1,15],quit:14,random:[4,14],randomload:14,rang:14,raw:[1,4],rdbms:[5,7],read:[2,9],readabl:1,real:1,recommend:0,recommender_npb:16,recomput:12,reconnect:9,record:[1,2],regist:2,regress:1,regularization_weight:[1,3],remot:[1,9],repair:1,repres:1,represent:[1,4,5],request:14,requir:[1,2,9,13,14,15],resourc:15,respect:[4,7],result:[1,4,5,7,8,12,16,17],result_window_rotate_s:1,retweet_count:2,reus:13,row:[1,2,14],rpc:[1,5,8,9,13,17],run:[1,8,9,13,16,17],rx1:9,rx2:9,same:[1,2,3,7,8],sampl:[2,4],sample:2,sample_weight:[1,3],save:[1,8,9],schema:1,scikit:[4,16,17],scipi:[1,2,6],score:1,scratch:[3,14],screen_nam:2,second:13,section:[1,4,9,12],see:[3,6,9,12,13,16],seed:[1,14],self:[1,14],sensit:1,separ:2,sequenc:[4,5],sequenti:2,serivc:1,server:[1,3,5,8,9,12,13],servic:[1,3,4,5,7],service:13,service_nam:1,session:1,set:[1,3,10,14],set_label:9,set_remot:1,set_timeout:1,setup:1,setup_logg:[1,10],shape:1,share:9,shebang:9,shell:0,shortcut:1,shortest:17,shot:[1,13],should:[1,14],show:[4,9,12,13,16],shuffl:[1,4,16],shuffled_dataset:4,side:[1,13],similar:[1,9,16],similar_row_from_datum:1,similar_row_from_id:1,similarli:7,simpl:[1,14,17],simpli:2,singl:[7,9,14],site:2,size:1,skip:[1,14],sklearn:4,sleep:9,slice:4,softmax:1,some:[1,2,4,8,9,16],sourc:[1,2,5,6,7,9],spars:[0,1],sparsematrixload:2,speci:16,specifeid:2,specifi:[1,2,3,4,7,12,13],stacktrac:13,standalon:[1,8,9],standard:[4,12],start:[1,3,8,9,13,15],stat:1,state:14,statu:[1,9],status:[1,2],status_keys:2,statuses_count:2,stderr:1,stop:[1,8,9,13],stream:[1,2,5,6,14,16],strict:9,strictli:1,string:[1,3,4,5,7,9,16],string_filter_rul:[1,3],string_filter_typ:[1,3],string_rul:[1,3],string_typ:[1,3],string_valu:[1,4],structur:1,subclass:1,submit:14,submodul:1,subset:4,succe:7,successfulli:9,suit:14,sum:14,support:[8,9,16],synopsi:11,syntax:9,system:[12,17],systemcontain:1,take:[4,8,9,14],target:1,task:8,tast:9,tcp:[1,8,13,17],templat:1,temporari:1,termin:8,test:[1,4,14,16],test_dataset:1,text:[1,2,12,14],than:[4,7],thei:[1,4],them:[1,3,17],thi:[1,2,4,9,12,13],though:4,thread:3,time:14,timeout:[1,9,13],timestamp_m:2,tmp:12,toi:16,tool:9,toolkit:15,topic:15,trace:16,train:[1,4,7,8,9,16],train_and_classifi:1,train_dataset:1,transform:1,treat:7,tri:[7,9],trigram:[1,3],truth:[5,7],tsv:2,tupl:1,turn:10,tweepi:2,twitter:[0,1],twitter_consumer_key:2,twitteroauth:2,twitteroauthhandl:2,twitterstreamload:2,two:[1,2,4,10],tx1:9,tx2:9,type:[1,2,3,4,5],ucb1:1,underli:2,unigram:[1,3],uniqu:7,unless:14,unlike:[1,12],unpickl:4,unstabl:1,until:[1,9,17],updat:[1,5,8],update:1,update_row:1,usag:[7,9,12,13],use:13,user:[1,2,4],user_data:1,user_nam:7,user_profil:7,usercontain:1,usr:9,usual:9,utf:2,util:[1,12],valid:[1,4,12,16],valu:[1,2,5,6,9,12,13,14],valuemapchainload:2,variabl:[2,10],variou:[1,5,14],vector:1,verbos:[9,13],version:[4,9],wai:4,want:[4,14],warn:2,watch:9,weight:0,weight_shogun:16,well:[3,17],when:[1,3,4,7,9,12,13,14],where:9,wherea:9,which:[1,2,4,9,12,14],whole:1,whose:[1,14],wiki:12,window:11,window_batch_s:1,window_s:[1,14],wish:12,without:[1,3,9],without_raw:1,work:3,world:4,wrap:6,write:[3,6],written:12,wrote:14,x_avg:14,xxxxxxxx:2,xxxxxxxxxxxxxxxxxxxx:2,xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx:2,xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx:2,yield:[1,14],you:[1,2,3,4,5,6,7,9,10,12,13,14,16,17],your:[2,6,7,9,10,14],zero:2,zip:2,ziparrayload:2},titles:["API Reference","jubakit package","jubakit.loader package","Config","Dataset","Architecture","Loader","Schema","Service","Shell","Frequently Asked Questions","User&#8217;s Guide","Jubamodel Reference","Jubash Reference","Loader Development Guide","Table of Contents","jubakit: Jubatus Toolkit","Overview"],titleterms:{"new":14,"static":4,access:4,alia:7,anomali:1,api:[0,8],architectur:5,arrai:2,asked:10,base:1,chain:2,classifi:1,command:9,compat:1,config:3,content:15,core:2,csv:2,data:[3,7],dataset:4,descript:[12,13],develop:14,dumb:1,exampl:[12,16],exist:14,extend:14,external:8,extraction:3,fallback:7,featur:3,filter:14,frequent:10,from:9,guid:[11,14],implement:14,install:16,integrat:9,invocat:8,jubakit:[1,2,9,16],jubamodel:12,jubash:[9,13],jubatu:[8,16],learn:3,licens:16,limit:9,line:9,list:[6,7,8],loader:[2,6,14],logger:1,machin:3,model:1,modul:[1,2],name:7,non:4,odbc:2,option:[12,13],overview:17,packag:[1,2],paramet:3,persist:4,predict:4,process:[8,14],question:10,quick:16,recommend:1,record:4,refer:[0,12,13],repl:9,requir:16,resourc:16,rule:3,schema:[4,7],script:9,servic:8,shell:[1,9],spars:2,start:16,structur:3,synopsi:[12,13],tabl:15,toolkit:16,topic:16,transform:[4,14],twitter:2,type:7,user:11,using:9,weight:1,window:14,work:8,workflow:9,write:9}})
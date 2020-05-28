(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{112:function(e,a,t){"use strict";t.r(a);var n=t(1),o=t.n(n),c=t(68),l=t.n(c),d=(t(84),t(85),t(9)),r=t(10),m=t(12),s=t(11),i=t(7),E=t(14),u=Object(E.a)(),A=t(69),N=t(22),O=function(e){Object(m.a)(t,e);var a=Object(s.a)(t);function t(e){return Object(d.a)(this,t),a.call(this,e)}return Object(r.a)(t,[{key:"render",value:function(){var e;return e=this.props.folderLink?o.a.createElement("h3",{href:this.props.folderLink},"Folder Link"):o.a.createElement("h3",{className:"status-bar"},"working..."),o.a.createElement("div",{className:"popup"},o.a.createElement("div",{className:"popup-inner"},o.a.createElement("div",{className:"pi"},o.a.createElement("div",{className:"pi1"},o.a.createElement("h1",null,this.props.text),o.a.createElement("div",null,e)),o.a.createElement("div",{className:"pi2"},o.a.createElement("div",{className:""},o.a.createElement("button",{className:"ui btn btn-primary btn-block",onClick:this.props.backToQuery},"Go Back to Query")),o.a.createElement("div",{className:""},o.a.createElement("button",{className:"ui btn btn-primary btn-block",onClick:this.props.newQuery},"New Query"))))))}}]),t}(o.a.Component),h=t(117),S=t(119),I=t(120),L=t(75),T=t(118),p=t(122),R=t(46),v=t.n(R),C=t(70),D=t.n(C),U=t(50),f=t(103),b=/^\d+/,y=/^\d{1,2}\/\d{1,2}\/\d{4}$/,M=function(e){Object(m.a)(t,e);var a=Object(s.a)(t);function t(e){var n;return Object(d.a)(this,t),(n=a.call(this,e)).successResGoogle=function(e){var a={response:e,query:n.handleSubmit()};console.log(a),v.a.defaults.xsrfCookieName="csrftoken",v.a.defaults.xsrfHeaderName="X-CSRFTOKEN",v.a.post("http://127.0.0.1:8000/query",a).then((function(e){alert(e.data)}))},n.failureResGoogle=function(e){var a="Query could not be performed: ";"popup_closed_by_user"===e.error?a+="The user closed the popup before finishing the sign in flow.":"idpiframe_initialization_failed"===e.error?a+="Initialization of the Google Auth API failed.\nPlease enable Third Party Cookies":"access_denied"===e.error?a+="The user denied the permission to the scopes required":"immediate_failed"===e.error?a+="No user could be automatically selected without prompting the consent flow.\nPlease Contact your developer":a+=e.error+" : "+e.details,alert(a)},n.state={showPopup:!1,folderLink:"",folder:"",spreadsheet:"",numRuns:"",freq:"week",geo:"us",geo_level:"country",startDate:"",endDate:"",numWeek:"",endToday:!1,terms:"",err:{folder:"",spreadsheet:"",numRuns:"",geo:"",geo_level:"",startDate:"",endDate:"",numWeek:"",terms:""}},n.getFolderLink=n.getFolderLink.bind(Object(N.a)(n)),n.handleInputChange=n.handleInputChange.bind(Object(N.a)(n)),n.handleSubmit=n.handleSubmit.bind(Object(N.a)(n)),n.handleDateChange=n.handleDateChange.bind(Object(N.a)(n)),n.handleEndTodayChange=n.handleEndTodayChange.bind(Object(N.a)(n)),n.handleNumWeekChange=n.handleNumWeekChange.bind(Object(N.a)(n)),n.newQuery=n.newQuery.bind(Object(N.a)(n)),n}return Object(r.a)(t,[{key:"getFolderLink",value:function(){f.get(window.location.href+"api/submit",(function(e){console.log(e)}))}},{key:"handleInputChange",value:function(e){var a=e.target,t=a.name,n=a.value,o=this.state.err;switch(console.log(t,n),t){case"folder":o.folder=n.length>=1?"":"Folder must be named";break;case"spreadsheet":o.spreadsheet=n.length>=1?"":"Spreadsheet must be named";break;case"terms":o.terms=n.length>=1?"":"Terms must be added to search, separated by commas";break;case"numRuns":o.numRuns=b.test(n)?"":"Must be a Number";break;case"endToday":this.handleEndTodayChange(n);break;case"startDate":o.startDate=y.test(n)?Object(h.a)(Object(S.a)(n,"MM/dd/yyyy",new Date))?"Date cannot be a future date":"":"Date must be in MM/DD/YYYY format","Date cannot be a future date"===o.startDate?alert(o.startDate):this.handleDateChange(t,n,o);break;case"endDate":o.endDate=y.test(n)?Object(h.a)(Object(S.a)(n,"MM/dd/yyyy",new Date))?"Date cannot be a future date":"":"Date must be in MM/DD/YYYY format","Date cannot be a future date"===o.endDate?alert(o.endDate):this.handleDateChange(t,n,o);break;case"numWeek":o.numWeek=parseInt(n)>0||!n?"":"Number must be positive",o.numWeek?alert(o.numWeek):this.handleNumWeekChange(n,o)}this.setState(Object(A.a)({err:o},t,n)),console.log(o)}},{key:"handleNumWeekChange",value:function(e,a){if(this.state.startDate&&!this.state.err.startDate){var t=Object(I.a)(Object(L.a)(Object(S.a)(this.state.startDate,"MM/dd/yyyy",new Date),e),"P");a.numWeek=Object(h.a)(Object(S.a)(this.state.endDate,"MM/dd/yyyy",new Date))?"End date cannot be a future date":"",a.numWeek||this.setState({endDate:t})}else if(this.state.endDate&&!this.state.err.endDate){var n=Object(I.a)(Object(T.a)(Object(S.a)(this.state.endDate,"MM/dd/yyyy",new Date),e),"P");this.setState({startDate:n})}else if(!this.state.endDate&&!this.state.err.endDate){t=Object(I.a)(Object(T.a)(new Date,e-1),"P"),n=Object(I.a)(Object(T.a)(Object(S.a)(t,"MM/dd/yyyy",new Date),e),"P");this.setState({startDate:n,endDate:t})}}},{key:"handleDateChange",value:function(e,a,t){if(!this.state.err.startDate&&!this.state.err.endDate){var n=this.state.endDate,o=this.state.startDate,c=this.state.numWeek;this.state.startDate&&"endDate"===e&&(n=a,c=Object(p.a)(Object(S.a)(n,"MM/dd/yyyy",new Date),Object(S.a)(o,"MM/dd/yyyy",new Date))),this.state.endDate&&"startDate"===e&&(o=a,c=Object(p.a)(Object(S.a)(n,"MM/dd/yyyy",new Date),Object(S.a)(o,"MM/dd/yyyy",new Date))),t.numWeek=c>0&&c?"":"Start Date must be before End Date",t.numWeek&&o&&n&&alert(t.numWeek),this.setState({err:t,numWeek:c})}}},{key:"handleEndTodayChange",value:function(e){if(e){var a=Object(I.a)(new Date,"P");this.setState({endDate:a})}}},{key:"validateInputs",value:function(e){var a=!0;return Object.values(e).forEach((function(e){return e.length>0&&(a=!1)})),this.state.folder&&this.state.spreadsheet&&this.state.numRuns&&this.state.startDate&&this.state.endDate&&this.state.terms||(a=!1),a}},{key:"handleSubmit",value:function(e){var a={query:{folder:this.state.folder,spreadsheet:this.state.spreadsheet,num_runs:this.state.numRuns,freq:this.state.freq,geo:this.state.geo,geo_level:this.state.geo_level,start_date:this.state.startDate,end_date:this.state.endDate,terms:this.state.terms}};return console.log("DATA",a),this.validateInputs(this.state.err)?a:(alert("Some fields have not been filled."),null)}},{key:"togglePopup",value:function(e){e.preventDefault(),console.log("TOGGLE POPUP");var a=this.validateInputs(this.state.err);console.log(a),this.setState({showPopup:!this.state.showPopup})}},{key:"newQuery",value:function(){var e=this.state.err;e.folder="",e.spreadsheet="",e.numRuns="",e.startDate="",e.endDate="",e.numWeek="",e.terms="",e.geo_level="",e.geo="",this.setState({spreadsheet:"",numRuns:"",freq:"",geo:"",geo_level:"",startDate:"",endDate:"",numWeek:"",endToday:!1,terms:""})}},{key:"handleNewQuery",value:function(e){e.preventDefault(),console.log("in Handle new Query"),this.newQuery(),this.togglePopup(e),console.log("end of handleNew query")}},{key:"render",value:function(){return o.a.createElement("div",{className:"container text-box"},o.a.createElement("form",{className:"ui form container",role:"form",onSubmit:this.handleSubmit},o.a.createElement("h2",null,"File Setup"),o.a.createElement("div",{className:"container drive-sec"},o.a.createElement("div",{className:"field"},o.a.createElement("div",{className:"label"},o.a.createElement("label",null,"Folder Name")),o.a.createElement("div",null,o.a.createElement("input",{type:"text",name:"folder",className:"form-control ' \n                                    ".concat(this.state.err.folder?"inval":""),placeholder:"Folder Name",onChange:this.handleInputChange}))),o.a.createElement("div",{className:"field"},o.a.createElement("div",{className:"label"},o.a.createElement("label",null,"Spreadsheet Name")),o.a.createElement("div",null,o.a.createElement("input",{type:"text",name:"spreadsheet",className:"form-control ' \n                                        ".concat(this.state.err.spreadsheet?"inval":""),placeholder:"Spreadsheet Name",onChange:this.handleInputChange})))),o.a.createElement("br",null),o.a.createElement("h2",null,"Query"),o.a.createElement("div",{className:"container query-sec"},o.a.createElement("div",{className:"form-sec form-sec-row"},o.a.createElement("div",{className:"field"},o.a.createElement("label",null,"Number of Runs "),o.a.createElement("input",{type:"text",name:"numRuns",className:"form-control num-runs ' \n                                    ".concat(this.state.err.numRuns?"inval":""),placeholder:"Number of Runs",onChange:this.handleInputChange})),o.a.createElement("div",{className:"field"},o.a.createElement("label",null,"Frequency"),o.a.createElement("select",{multiple:"",name:"freq",className:"ui dropdown form-control",onChange:this.handleInputChange},o.a.createElement("option",{defaultValue:!0,value:"week"},"Week"),o.a.createElement("option",{value:"day"},"Day"),o.a.createElement("option",{value:"month"},"Month"),o.a.createElement("option",{value:"year"},"Year"))),o.a.createElement("div",{className:"field"},o.a.createElement("label",null,"Geographical Level"),o.a.createElement("select",{multiple:"",name:"geo_level",className:"ui dropdown form-control",onChange:this.handleInputChange},o.a.createElement("option",{defaultValue:!0,value:"country"},"Country"),o.a.createElement("option",{value:"region"},"Region"),o.a.createElement("option",{value:"dma"},"Nielsen DMA"))),o.a.createElement("div",{className:"field"},o.a.createElement("label",null,"Geographical Area "),o.a.createElement("select",{multiple:"",name:"geo",className:"ui dropdown form-control",onChange:this.handleInputChange},"country"===this.state.geo_level?o.a.createElement("option",{defaultValue:!0,value:"US"},"US"):"region"===this.state.geo_level?U.region.map((function(e){return o.a.createElement("option",{key:e.code,value:e.code},e.name," (",e.code,")")})):"dma"===this.state.geo_level?U.dma.map((function(e){return o.a.createElement("option",{key:e.code,value:e.code},e.name," (",e.code,")")})):null,";"))),o.a.createElement("div",{className:"form-sec"},o.a.createElement("div",{className:"form-sec date-level"},o.a.createElement("div",{className:"form-sec-row"},o.a.createElement("div",{className:"field"},o.a.createElement("label",null,"Start Date"),o.a.createElement("input",{type:"text",name:"startDate",className:"form-control date-input \n                                                ".concat(this.state.err.startDate?"inval":""),placeholder:"mm/dd/yyyy",value:this.state.startDate,onChange:this.handleInputChange})),o.a.createElement("div",{className:"field"},o.a.createElement("label",null,"End Date"),o.a.createElement("input",{type:"text",name:"endDate",className:"form-control date-input \n                                                ".concat(this.state.err.endDate?"inval":""),placeholder:"mm/dd/yyyy",value:this.state.endDate,onChange:this.handleInputChange}))),o.a.createElement("div",{className:"d1"},o.a.createElement("div",{className:"field date-level date-in"},o.a.createElement("label",null,"Number of Weeks"),o.a.createElement("input",{type:"text",name:"numWeek",className:"form-control num-week-input date-input'\n                                                ".concat(this.state.err.numWeek?"inval":""),placeholder:"# Weeks",value:this.state.numWeek,onChange:this.handleInputChange}))))),o.a.createElement("div",{className:"field form-sec"},o.a.createElement("div",{className:"label"},o.a.createElement("label",null,"Terms")),o.a.createElement("textarea",{type:"text",name:"terms",className:"form-control ' \n                                ".concat(this.state.err.terms?"inval":""),placeholder:"Terms",onChange:this.handleInputChange}))),o.a.createElement("br",null),o.a.createElement("div",{className:"container for-sec"},o.a.createElement(D.a,{clientId:"135294837231-342jgurpklaa1nhg563a986ethc2kdev.apps.googleusercontent.com",buttonText:"Submit Query and Connect to Google Account",onSuccess:this.successResGoogle,onFailure:this.failureResGoogle,cookiePolicy:"single_host_origin",accessType:"offline",responseType:"code",scope:"https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/documents"}),this.state.showPopup?o.a.createElement(O,{text:"Working on the Query",backToQuery:this.togglePopup.bind(this),newQuery:this.handleNewQuery.bind(this),folderLink:this.state.folderLink}):null)))}}]),t}(n.Component),g=t(121),H=t(71),k=t.n(H),P=function(e){Object(m.a)(t,e);var a=Object(s.a)(t);function t(e){var n;return Object(d.a)(this,t),(n=a.call(this,e)).state={},n}return Object(r.a)(t,[{key:"render",value:function(){return o.a.createElement("div",{className:"container page-container"},o.a.createElement("img",{src:k.a,className:"App-logo",alt:"logo"}),o.a.createElement("div",null,o.a.createElement("h1",null,"Welcome to the Health Trends App!"),o.a.createElement("h2",null,"Researcher: Dr. John Nakayama"),o.a.createElement("h3",null,"Developer: Madison Hillyard")),o.a.createElement("div",null,o.a.createElement("div",{className:"query-button"},o.a.createElement("form",null,o.a.createElement(g.a,{variant:"ui btn btn-primary btn-block",onClick:function(){return u.push("/QueryTrends")}},"Make a Health Trends Query"))),o.a.createElement("div",{className:"map-button"},o.a.createElement("form",null,o.a.createElement(g.a,{variant:"ui btn btn-primary btn-block",onClick:function(){return u.push("/Map")}},"Check out our Covid Map")))))}}]),t}(n.Component),G=t(63),W=t(35),B=t(73),j={VT:[50,-8],NH:[34,2],MA:[30,-1],RI:[28,2],CT:[35,10],NJ:[34,1],DE:[33,0],MD:[47,10],DC:[49,21]},w=function(e){Object(m.a)(t,e);var a=Object(s.a)(t);function t(){return Object(d.a)(this,t),a.apply(this,arguments)}return Object(r.a)(t,[{key:"render",value:function(){return o.a.createElement(W.ComposableMap,{projection:"geoAlbersUsa"},o.a.createElement(W.Geographies,{geography:"https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"},(function(e){var a=e.geographies;return o.a.createElement(o.a.Fragment,null,a.map((function(e){return o.a.createElement(W.Geography,{key:e.rsmKey,stroke:"#FFF",geography:e,fill:"#DDD",style:{default:{fill:"#D6D6DA",outline:"none"},hover:{fill:"#F53",outline:"none"},pressed:{fill:"#E42",outline:"none"}}})})),a.map((function(e){var a=Object(G.a)(e),t=B.find((function(a){return a.val===e.id}));return o.a.createElement("g",{key:e.rsmKey+"-name"},t&&a[0]>-160&&a[0]<-67&&(-1===Object.keys(j).indexOf(t.id)?o.a.createElement(W.Marker,{coordinates:a},o.a.createElement("text",{y:"2",fontSize:14,textAnchor:"middle"},t.id)):o.a.createElement(W.Annotation,{subject:a,dx:j[t.id][0],dy:j[t.id][1]},o.a.createElement("text",{x:4,fontSize:14,alignmentBaseline:"middle"},t.id))))})))})))}}]),t}(n.Component),F=function(e){Object(m.a)(t,e);var a=Object(s.a)(t);function t(){return Object(d.a)(this,t),a.apply(this,arguments)}return Object(r.a)(t,[{key:"render",value:function(){return o.a.createElement("div",{className:"container ui"},o.a.createElement("div",{className:"header"},o.a.createElement("div",null,o.a.createElement("h1",null,"Covid Map"))),o.a.createElement("div",{className:"map-page"},o.a.createElement("div",{className:"map-container"},o.a.createElement("h3",null,"Map Box")),o.a.createElement("div",{className:"control-panel"},o.a.createElement("h3",null,"Control Panel"),o.a.createElement("div",null,o.a.createElement("label",null,"Term Sets"),o.a.createElement("select",{multiple:"",name:"terms",className:"ui dropdown form-control",onChange:this.handleInputChange},o.a.createElement("option",{defaultValue:!0,value:"bca"},"Breast Cancer Terms"),o.a.createElement("option",{value:"covid"},"COVID 19 Terms"),o.a.createElement("option",{value:"ect"},"ECT.."))))),o.a.createElement("div",null,o.a.createElement(w,null)))}}]),t}(n.Component),K=function(e){Object(m.a)(t,e);var a=Object(s.a)(t);function t(){return Object(d.a)(this,t),a.apply(this,arguments)}return Object(r.a)(t,[{key:"render",value:function(){return o.a.createElement(i.b,{history:u},o.a.createElement(i.c,null,o.a.createElement(i.a,{path:"/",exact:!0,component:P}),o.a.createElement(i.a,{path:"/QueryTrends",component:M}),o.a.createElement(i.a,{path:"/Map",component:F})))}}]),t}(n.Component),Y=function(e){Object(m.a)(t,e);var a=Object(s.a)(t);function t(){return Object(d.a)(this,t),a.apply(this,arguments)}return Object(r.a)(t,[{key:"render",value:function(){return o.a.createElement("div",{className:"container ui"},o.a.createElement("div",{className:"header"},o.a.createElement("div",null,o.a.createElement("h1",null,"Health API Research Tool"))))}}]),t}(n.Component),V=function(e){Object(m.a)(t,e);var a=Object(s.a)(t);function t(){return Object(d.a)(this,t),a.apply(this,arguments)}return Object(r.a)(t,[{key:"render",value:function(){return o.a.createElement("div",{className:"container ui"},o.a.createElement("div",{className:"footer"},o.a.createElement("div",null,"Need Help? email me here")))}}]),t}(n.Component);var x=function(){return o.a.createElement("div",{className:"App page-container"},o.a.createElement(Y,null),o.a.createElement(K,null),o.a.createElement(V,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var Q=t(49);t(109);l.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(Q.a,null,o.a.createElement(x,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},50:function(e){e.exports=JSON.parse('{"dma":[{"code":"881","name":"SPOKANE"},{"code":"868","name":"CHICO-REDDING"},{"code":"866","name":"FRESNO-VISALIA"},{"code":"862","name":"SACRAMENTO-STOCKTON-MODESTO"},{"code":"855","name":"SANTA BARBARA-SANTA MARIA-SAN LUIS OBISPO"},{"code":"839","name":"LAS VEGAS"},{"code":"828","name":"MONTEREY-SALINAS"},{"code":"825","name":"SAN DIEGO"},{"code":"821","name":"BEND"},{"code":"820","name":"PORTLAND"},{"code":"819","name":"SEATTLE-TACOMA"},{"code":"813","name":"MEDFORD-KLAMATH FALLS"},{"code":"811","name":"RENO"},{"code":"810","name":"YAKIMA-PASCO-RICHLAND-KENNEWICK"},{"code":"807","name":"SAN FRANCISCO-OAKLAND-SAN JOSE"},{"code":"804","name":"PALM SPRINGS"},{"code":"803","name":"LOS ANGELES"},{"code":"802","name":"EUREKA"},{"code":"801","name":"EUGENE"},{"code":"800","name":"BAKERSFIELD"},{"code":"798","name":"GLENDIVE"},{"code":"790","name":"ALBUQUERQUE-SANTA FE"},{"code":"789","name":"TUCSON (SIERRA VISTA)"},{"code":"773","name":"GRAND JUNCTION-MONTROSE"},{"code":"771","name":"YUMA-EL CENTRO"},{"code":"770","name":"SALT LAKE CITY"},{"code":"767","name":"CASPER-RIVERTON"},{"code":"766","name":"HELENA"},{"code":"765","name":"EL PASO (LAS CRUCES)"},{"code":"764","name":"RAPID CITY"},{"code":"762","name":"MISSOULA"},{"code":"760","name":"TWIN FALLS"},{"code":"759","name":"CHEYENNE-SCOTTSBLUFF"},{"code":"758","name":"IDAHO FALLS-POCATELLO"},{"code":"757","name":"BOISE"},{"code":"756","name":"BILLINGS"},{"code":"755","name":"GREAT FALLS"},{"code":"754","name":"BUTTE-BOZEMAN"},{"code":"753","name":"PHOENIX (PRESCOTT)"},{"code":"752","name":"COLORADO SPRINGS-PUEBLO"},{"code":"751","name":"DENVER"},{"code":"749","name":"LAREDO"},{"code":"747","name":"JUNEAU"},{"code":"746","name":"BILOXI-GULFPORT"},{"code":"745","name":"FAIRBANKS"},{"code":"744","name":"HONOLULU"},{"code":"743","name":"ANCHORAGE"},{"code":"740","name":"NORTH PLATTE"},{"code":"737","name":"MANKATO"},{"code":"736","name":"BOWLING GREEN"},{"code":"734","name":"JONESBORO"},{"code":"725","name":"SIOUX FALLS (MITCHELL)"},{"code":"724","name":"FARGO-VALLEY CITY"},{"code":"722","name":"LINCOLN & HASTINGS-KEARNEY PLUS"},{"code":"718","name":"JACKSON"},{"code":"717","name":"QUINCY-HANNIBAL-KEOKUK"},{"code":"716","name":"BATON ROUGE"},{"code":"711","name":"MERIDIAN"},{"code":"710","name":"HATTIESBURG-LAUREL"},{"code":"709","name":"TYLER-LONGVIEW (LUFKIN & NACOGDOCHES)"},{"code":"705","name":"WAUSAU-RHINELANDER"},{"code":"702","name":"LA CROSSE-EAU CLAIRE"},{"code":"698","name":"MONTGOMERY-SELMA"},{"code":"693","name":"LITTLE ROCK-PINE BLUFF"},{"code":"692","name":"BEAUMONT-PORT ARTHUR"},{"code":"691","name":"HUNTSVILLE-DECATUR (FLORENCE)"},{"code":"687","name":"MINOT-BISMARCK-DICKINSON (WILLISTON)"},{"code":"686","name":"MOBILE, AL-PENSACOLA (FT. WALTON BEACH)"},{"code":"682","name":"DAVENPORT-ROCK ISLAND-MOLINE"},{"code":"679","name":"DES MOINES-AMES"},{"code":"678","name":"WICHITA-HUTCHINSON PLUS"},{"code":"676","name":"DULUTH-SUPERIOR"},{"code":"675","name":"PEORIA-BLOOMINGTON"},{"code":"673","name":"COLUMBUS-TUPELO-WEST POINT"},{"code":"671","name":"TULSA"},{"code":"670","name":"FT. SMITH-FAYETTEVILLE-SPRINGDALE-ROGERS"},{"code":"669","name":"MADISON"},{"code":"662","name":"ABILENE-SWEETWATER"},{"code":"661","name":"SAN ANGELO"},{"code":"659","name":"NASHVILLE"},{"code":"658","name":"GREEN BAY-APPLETON"},{"code":"657","name":"SHERMAN-ADA"},{"code":"656","name":"PANAMA CITY"},{"code":"652","name":"OMAHA"},{"code":"651","name":"LUBBOCK"},{"code":"650","name":"OKLAHOMA CITY"},{"code":"649","name":"EVANSVILLE"},{"code":"648","name":"CHAMPAIGN & SPRINGFIELD-DECATUR"},{"code":"647","name":"GREENWOOD-GREENVILLE"},{"code":"644","name":"ALEXANDRIA"},{"code":"643","name":"LAKE CHARLES"},{"code":"642","name":"LAFAYETTE"},{"code":"641","name":"SAN ANTONIO"},{"code":"640","name":"MEMPHIS"},{"code":"639","name":"JACKSON"},{"code":"638","name":"ST. JOSEPH"},{"code":"637","name":"CEDAR RAPIDS-WATERLOO-IOWA CITY & DUBUQUE"},{"code":"636","name":"HARLINGEN-WESLACO-BROWNSVILLE-MCALLEN"},{"code":"635","name":"AUSTIN"},{"code":"634","name":"AMARILLO"},{"code":"633","name":"ODESSA-MIDLAND"},{"code":"632","name":"PADUCAH-CAPE GIRARDEAU-HARRISBURG"},{"code":"631","name":"OTTUMWA, IA-KIRKSVILLE"},{"code":"630","name":"BIRMINGHAM (ANNISTON AND TUSCALOOSA)"},{"code":"628","name":"MONROE, LA-EL DORADO"},{"code":"627","name":"WICHITA FALLS & LAWTON"},{"code":"626","name":"VICTORIA"},{"code":"625","name":"WACO-TEMPLE-BRYAN"},{"code":"624","name":"SIOUX CITY"},{"code":"623","name":"DALLAS-FORT WORTH"},{"code":"622","name":"NEW ORLEANS"},{"code":"619","name":"SPRINGFIELD"},{"code":"618","name":"HOUSTON"},{"code":"617","name":"MILWAUKEE"},{"code":"616","name":"KANSAS CITY"},{"code":"613","name":"MINNEAPOLIS-ST. PAUL"},{"code":"612","name":"SHREVEPORT"},{"code":"611","name":"ROCHESTER-MASON CITY-AUSTIN"},{"code":"610","name":"ROCKFORD"},{"code":"609","name":"ST. LOUIS"},{"code":"606","name":"DOTHAN"},{"code":"605","name":"TOPEKA"},{"code":"604","name":"COLUMBIA-JEFFERSON CITY"},{"code":"603","name":"JOPLIN-PITTSBURG"},{"code":"602","name":"CHICAGO"},{"code":"600","name":"CORPUS CHRISTI"},{"code":"598","name":"CLARKSBURG-WESTON"},{"code":"597","name":"PARKERSBURG"},{"code":"596","name":"ZANESVILLE"},{"code":"592","name":"GAINESVILLE"},{"code":"588","name":"SOUTH BEND-ELKHART"},{"code":"584","name":"CHARLOTTESVILLE"},{"code":"583","name":"ALPENA"},{"code":"582","name":"LAFAYETTE"},{"code":"581","name":"TERRE HAUTE"},{"code":"577","name":"WILKES-BARRE-SCRANTON"},{"code":"576","name":"SALISBURY"},{"code":"575","name":"CHATTANOOGA"},{"code":"574","name":"JOHNSTOWN-ALTOONA"},{"code":"573","name":"ROANOKE-LYNCHBURG"},{"code":"571","name":"FT. MYERS-NAPLES"},{"code":"570","name":"MYRTLE BEACH-FLORENCE"},{"code":"569","name":"HARRISONBURG"},{"code":"567","name":"GREENVILLE-SPARTANBURG-ASHEVILLE-ANDERSON"},{"code":"566","name":"HARRISBURG-LANCASTER-LEBANON-YORK"},{"code":"565","name":"ELMIRA (CORNING)"},{"code":"564","name":"CHARLESTON-HUNTINGTON"},{"code":"563","name":"GRAND RAPIDS-KALAMAZOO-BATTLE CREEK"},{"code":"561","name":"JACKSONVILLE"},{"code":"560","name":"RALEIGH-DURHAM (FAYETTEVILLE)"},{"code":"559","name":"BLUEFIELD-BECKLEY-OAK HILL"},{"code":"558","name":"LIMA"},{"code":"557","name":"KNOXVILLE"},{"code":"556","name":"RICHMOND-PETERSBURG"},{"code":"555","name":"SYRACUSE"},{"code":"554","name":"WHEELING-STEUBENVILLE"},{"code":"553","name":"MARQUETTE"},{"code":"552","name":"PRESQUE ISLE"},{"code":"551","name":"LANSING"},{"code":"550","name":"WILMINGTON"},{"code":"549","name":"WATERTOWN"},{"code":"548","name":"WEST PALM BEACH-FT. PIERCE"},{"code":"547","name":"TOLEDO"},{"code":"546","name":"COLUMBIA"},{"code":"545","name":"GREENVILLE-NEW BERN-WASHINGTON"},{"code":"544","name":"NORFOLK-PORTSMOUTH-NEWPORT NEWS"},{"code":"543","name":"SPRINGFIELD-HOLYOKE"},{"code":"542","name":"DAYTON"},{"code":"541","name":"LEXINGTON"},{"code":"540","name":"TRAVERSE CITY-CADILLAC"},{"code":"539","name":"TAMPA-ST. PETERSBURG (SARASOTA)"},{"code":"538","name":"ROCHESTER"},{"code":"537","name":"BANGOR"},{"code":"536","name":"YOUNGSTOWN"},{"code":"535","name":"COLUMBUS"},{"code":"534","name":"ORLANDO-DAYTONA BEACH-MELBOURNE"},{"code":"533","name":"HARTFORD & NEW HAVEN"},{"code":"532","name":"ALBANY-SCHENECTADY-TROY"},{"code":"531","name":"TRI-CITIES, TN-VA"},{"code":"530","name":"TALLAHASSEE-THOMASVILLE"},{"code":"529","name":"LOUISVILLE"},{"code":"528","name":"MIAMI-FT. LAUDERDALE"},{"code":"527","name":"INDIANAPOLIS"},{"code":"526","name":"UTICA"},{"code":"525","name":"ALBANY"},{"code":"524","name":"ATLANTA"},{"code":"523","name":"BURLINGTON PLATTSBURGH"},{"code":"522","name":"COLUMBUS"},{"code":"521","name":"PROVIDENCE-NEW BEDFORD"},{"code":"520","name":"AUGUSTA"},{"code":"519","name":"CHARLESTON"},{"code":"518","name":"GREENSBORO-HIGH POINT-WINSTON-SALEM"},{"code":"517","name":"CHARLOTTE"},{"code":"516","name":"ERIE"},{"code":"515","name":"CINCINNATI"},{"code":"514","name":"BUFFALO"},{"code":"513","name":"FLINT-SAGINAW-BAY CITY"},{"code":"512","name":"BALTIMORE"},{"code":"511","name":"WASHINGTON, DC (HAGERSTOWN)"},{"code":"510","name":"CLEVELAND-AKRON (CANTON)"},{"code":"509","name":"FT. WAYNE"},{"code":"508","name":"PITTSBURGH"},{"code":"507","name":"SAVANNAH"},{"code":"506","name":"BOSTON (MANCHESTER)"},{"code":"505","name":"DETROIT"},{"code":"504","name":"PHILADELPHIA"},{"code":"503","name":"MACON"},{"code":"502","name":"BINGHAMTON"},{"code":"501","name":"NEW YORK"},{"code":"500","name":"PORTLAND-AUBURN"},{"code":"498","name":"NORTHERN MARIANA ISLANDS"},{"code":"495","name":"GUAM"},{"code":"493","name":"AMERICAN SAMOA"},{"code":"491","name":"VIRGIN ISLANDS"},{"code":"490","name":"PUERTO RICO"}],"region":[{"code":"US-AL","name":"Alabama"},{"code":"US-AK","name":"Alaska"},{"code":"US-AS","name":"American Samoa (see also separate country code entry under AS)"},{"code":"US-AZ","name":"Arizona"},{"code":"US-AR","name":"Arkansas"},{"code":"US-CA","name":"California"},{"code":"US-CO","name":"Colorado"},{"code":"US-CT","name":"Connecticut"},{"code":"US-DE","name":"Delaware"},{"code":"US-DC","name":"District of Columbia"},{"code":"US-FL","name":"Florida"},{"code":"US-GA","name":"Georgia"},{"code":"US-GU","name":"Guam (see also separate country code entry under GU)"},{"code":"US-HI","name":"Hawaii"},{"code":"US-ID","name":"Idaho"},{"code":"US-IL","name":"Illinois"},{"code":"US-IN","name":"Indiana"},{"code":"US-IA","name":"Iowa"},{"code":"US-KS","name":"Kansas"},{"code":"US-KY","name":"Kentucky"},{"code":"US-LA","name":"Louisiana"},{"code":"US-ME","name":"Maine"},{"code":"US-MD","name":"Maryland"},{"code":"US-MA","name":"Massachusetts"},{"code":"US-MI","name":"Michigan"},{"code":"US-MN","name":"Minnesota"},{"code":"US-MS","name":"Mississippi"},{"code":"US-MO","name":"Missouri"},{"code":"US-MT","name":"Montana"},{"code":"US-NE","name":"Nebraska"},{"code":"US-NV","name":"Nevada"},{"code":"US-NH","name":"New Hampshire"},{"code":"US-NJ","name":"New Jersey"},{"code":"US-NM","name":"New Mexico"},{"code":"US-NY","name":"New York"},{"code":"US-NC","name":"North Carolina"},{"code":"US-ND","name":"North Dakota"},{"code":"US-MP","name":"Northern Mariana Islands (see also separate country code entry under MP)"},{"code":"US-OH","name":"Ohio"},{"code":"US-OK","name":"Oklahoma"},{"code":"US-OR","name":"Oregon"},{"code":"US-PA","name":"Pennsylvania"},{"code":"US-PR","name":"Puerto Rico (see also separate country code entry under PR)"},{"code":"US-RI","name":"Rhode Island"},{"code":"US-SC","name":"South Carolina"},{"code":"US-SD","name":"South Dakota"},{"code":"US-TN","name":"Tennessee"},{"code":"US-TX","name":"Texas"},{"code":"US-UM","name":"United States Minor Outlying Islands (see also separate country code entry under UM)"},{"code":"US-UT","name":"Utah"},{"code":"US-VT","name":"Vermont"},{"code":"US-VI","name":"Virgin Islands, U.S. (see also separate country code entry under VI)"},{"code":"US-VA","name":"Virginia"},{"code":"US-WA","name":"Washington"},{"code":"US-WV","name":"West Virginia"},{"code":"US-WI","name":"Wisconsin"},{"code":"US-WY","name":"Wyoming"}]}')},71:function(e,a,t){e.exports=t.p+"static/media/logo.5d5d9eef.svg"},73:function(e){e.exports=JSON.parse('[{"id":"AL","val":"01"},{"id":"AK","val":"02"},{"id":"AS","val":"60"},{"id":"AZ","val":"04"},{"id":"AR","val":"05"},{"id":"CA","val":"06"},{"id":"CO","val":"08"},{"id":"CT","val":"09"},{"id":"DE","val":"10"},{"id":"DC","val":"11"},{"id":"FL","val":"12"},{"id":"FM","val":"64"},{"id":"GA","val":"13"},{"id":"GU","val":"66"},{"id":"HI","val":"15"},{"id":"ID","val":"16"},{"id":"IL","val":"17"},{"id":"IN","val":"18"},{"id":"IA","val":"19"},{"id":"KS","val":"20"},{"id":"KY","val":"21"},{"id":"LA","val":"22"},{"id":"ME","val":"23"},{"id":"MH","val":"68"},{"id":"MD","val":"24"},{"id":"MA","val":"25"},{"id":"MI","val":"26"},{"id":"MN","val":"27"},{"id":"MS","val":"28"},{"id":"MO","val":"29"},{"id":"MT","val":"30"},{"id":"NE","val":"31"},{"id":"NV","val":"32"},{"id":"NH","val":"33"},{"id":"NJ","val":"34"},{"id":"NM","val":"35"},{"id":"NY","val":"36"},{"id":"NC","val":"37"},{"id":"ND","val":"38"},{"id":"MP","val":"69"},{"id":"OH","val":"39"},{"id":"OK","val":"40"},{"id":"OR","val":"41"},{"id":"PW","val":"70"},{"id":"PA","val":"42"},{"id":"PR","val":"72"},{"id":"RI","val":"44"},{"id":"SC","val":"45"},{"id":"SD","val":"46"},{"id":"TN","val":"47"},{"id":"TX","val":"48"},{"id":"UM","val":"74"},{"id":"UT","val":"49"},{"id":"VT","val":"50"},{"id":"VA","val":"51"},{"id":"VI","val":"78"},{"id":"WA","val":"53"},{"id":"WV","val":"54"},{"id":"WI","val":"55"},{"id":"WY","val":"56"}]')},79:function(e,a,t){e.exports=t(112)},84:function(e,a,t){},85:function(e,a,t){}},[[79,1,2]]]);
//# sourceMappingURL=main.523e213d.chunk.js.map
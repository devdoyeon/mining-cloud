# MINING CLOUD

<br><hr>

## **Common Components | _Components/Common_**

> ### **Header**
>
> 모든 컴포넌트에 들어가는 헤더입니다. 항시 마운트 되어 있습니다.

> ### **SideBar**
>
> 모든 컴포넌트에 들어가는 사이드바입니다. menuBtn(setMenuBtn) State를 이용해 사이드바가 열림 상태인지 닫힘 상태인지 파악해 class명을 조작해 css를 수정하게 했고, 열림 상태일 때 사이드바 구역이 아닌 다른 구역을 클릭했을 때 자동으로 닫히게끔 구현했습니다. 항시 마운트 되어 있습니다.

> ### **DataUploadComp**
>
> Home을 제외한 모든 컴포넌트에 들어가는 데이터 업로드 리스트입니다. input[type=file]에 파일을 업로드 했을 때 마운트 되며, 업로드 된 파일의 파일명을 보여줍니다. 업로드 된 파일이 단일 파일이 아닌 복수 파일일 경우업로드된 파일명을 테이블로 보여주게끔 했습니다.

> ### **Loading**
>
> msg(setMsg) State를 통해 조작되는 컴포넌트입니다. API 요청이 진행 중일 때 해당 컴포넌트가 마운트 되며, API 요청이 끝난 후 msg State가 download로 변경되었을 때 언마운트 됩니다.

<br><hr>

## **Common Function | _common.js_**

> ### **errorList()**
>
> 에러 메시지 배열을 정리해둔 객체입니다.

> ### **errorHandler()**
>
> 에러가 발생했을 때 파일 목록을 비롯한 State를 초기화 시켜주는 에러 핸들링 함수입니다.

> ### **startFn()**
>
> 버튼을 클릭했을 때 해당 함수를 실행하기 전 확인해야 할 필수 요소를 확인해 주는 함수입니다.

> ### **fileSetting()**
>
> `input[type=file]`이 변경 되었을 때(onChange) 실행되는 함수입니다. 대부분 단일 파일이지만 모델 학습 및 검증 탭에서는 6개의 복수 파일이 들어가기 때문에 복수 파일일 경우를 조건문으로 제시하여 모델 학습 및 검증 탭에서만 사용할 수 있게끔 작성해 두었습니다.

> ### **makeFileName()**
>
> 파일을 다운로드 하기 전 파일의 이름을 만들어 주는 함수입니다. Common State인 fileInfo에서 업로드 된 파일의 이름을 가져와 그에 맞게 가공하여 이름을 만들어 줍니다.

> ### **zipParse()**
>
> Zip 파일을 UnZip하여 파일을 파싱한 후 Blob을 만든 뒤 Stream 형식으로 파일을 다운로드 받을 수 있게끔 해준 함수입니다. Blob을 조각내 용량을 줄여준 후 Preview Table을 구현할 수 있도록 했습니다.

> ### **chart2png()**
>
> 차트 라이브러리를 통해 만든 데이터를 html2canvas 라이브러리를 사용해 이미지 파일로 다운로드 받게 해주는 함수입니다.

> ### **table2csv()**
>
> table 태그로 그려진 표를 csv 파일로 다운로드 받을 수 있게 해주는 함수입니다.

> ### **csv2table()**
>
> csv 파일의 문자열을 가공하여 미리보기 테이블을 렌더하기 위해 필요한 데이터셋을 만들어 주는 함수입니다.

> ### **previewThead(), previewTbody()**
>
> csv2table()에서 가공된 데이터셋을 테이블로 만들어 주는 함수입니다.

<br><hr>

## **Common State | _state(setState) :type_**

> ### **fileInfo(setFileInfo) :Object**
>
> 업로드된 파일의 정보를 담고 있습니다. 파일 이름을 만들거나 API 요청을 보낼 때 사용됩니다.  
> `file: string(파일) | name: string(파일명)`

> ### **table(setTable) :Object**
>
> 테이블을 렌더하기 위해 tHead, tBody에 들어갈 데이터를 담고 있습니다. Preview Table을 렌더할 때 사용됩니다.  
> `tHead: array(테이블 헤더) | tBody: array(테이블 바디)`

> ### **msg(setMsg) :String**
>
> 로딩 중 혹은 다운로드가 가능한 상태 등의 API 요청 상태를 나타낼 때 사용합니다.

> ### **tab(setTab) :String**
>
> 한 페이지에서 각자 다른 버튼을 눌렀을 때 해당 탭을 보여주기 위해 사용하는 State입니다.

> ### **blob(setBlob) :String**
>
> FileSaver.js를 사용해 파일을 다운로드 받기 위해 Blob을 저장해 주는 State입니다.

> ### **arr(setArr) :Array**
>
> 파일을 ArrayBuffer로 변환하여 담아두는 State입니다. Stream Saver 라이브러리를 사용해 Zip 파일을 파싱할 때 사용됩니다.

<br><hr>

## **Common State Set | _StateSet = { state1, state2, ...}_**

> ### **fileSettingState = { setFileInfo, setTab, setMsg }**
>
> common.js/fileSettingFn()에서 사용하기 위한 Parameter를 담아둔 State입니다. event와 함께 사용됩니다.

> ### **startParamState = { msg, setMsg, setTab, fileInfo }**
>
> common.js/startFn()에서 사용하기 위한 Parameter를 담아둔 State입니다. event와 함께 사용됩니다.

> ### **zipParseState = { setTable, setArr, setMsg }**
>
> common.js/zipParse()에서 사용하기 위한 Parameter를 담아둔 State입니다.

<br><hr>

## **API Request Headers**

> ### **headers**
>
> csv 파일을 받아올 때 사용되는 헤더입니다.  
> `'Content-Type': 'multipart/form-data'`

> ### **zipHeaders**
>
> zip 파일을 받아올 때 사용되는 헤더입니다.  
> ` responseType: 'arraybuffer', headers: { 'Content-Type': 'multipart/form-data'}`

<br><hr>

## **Issues**

> ### **변수 분석 및 선택(Analysis)**
>
> 상관분석을 제외한 교차분석, CART분석에서는 각각 차트 라이브러리로 구현한 그래프와 테이블을 통해 시각화를 구현하였으나 상관분석에서는 두 개의 테이블과 base64로 이루어진 이미지를 보여주어야 했고, Table Export 라이브러리를 통한 다운로드를 구현할 때 테이블의 데이터가 많아 다운로드 시간이 지나치게 많이 소요됨에 따라 text/csv 데이터를 만들어야 했습니다. 데이터셋이 text/csv 형식으로 오는 것이 아닌 Object 형식으로 왔기 때문에 해당 데이터를 가공하여 csv를 만들었고 csv를 다운로드 할 때 다운로드 url을 담는 State를 common.js/download 함수에 인자로 넣었으나 정상 작동하지 않아 해당 컴포넌트 내에 각각 테이블을 csv 파일로 다운로드 해주는 함수를 따로 정의해 두었습니다.

> ### **모델 학습 및 검증(Training)**
>
> 다른 과정에서는 업로드 파일이 모두 단일 파일이지만 해당 과정에서는 복수 파일을 업로드 해야 하며, 업로드 가능한 파일명 또한 정해져 있었기 때문에 common.js/fileSetting 함수에서 업로드된 파일이 복수일 경우 파일명을 검사해 준 뒤 API 요청을 하기 위한 FormData를 만들어 주는 과정을 거쳤습니다. 또한 업로드 할 수 있는 파일의 파일명을 알려주는 가이드를 구현하였습니다.

<br><hr>

## **Changelog**

### **#20220825**

> Zip 전체를 다운로드 받는 방식에서 큰 파일을 Stream 방식으로 다운로드 받을 수 있는 방법을 생각해내 StreamSaver 라이브러리를 통해 Zip 내부 csv 파일에 접근하여 다운로드 받는 기능을 구현 완료했습니다. 또한 하나의 Blob을 10개로 쪼개어서 첫 번째와 마지막 Blob을 합친 뒤 Preview Table을 보여주게끔 구현했습니다. Common Function에 zipParse()를 추가하여 이 과정을 재사용 함수로 분리 시켰습니다.  
> `Zip -> UnZip -> Parse File -> Create Blob -> Split Blob -> Merged Blob`

> `url(setUrl)`과 `download()`를 제거하고 FileSaver.js 라이브러리를 사용하기 위해 `blob(setBlob)` state를 추가하였습니다. 이는 API 요청을 통해 csv Binary Data를 받아오는 탭에서만 수정된 사항입니다.

> 다운로드 버튼에 직접 걸어둔 Stream Download 주석 포함 코드입니다.

```js
<button
  onClick={() => {
    // state에 저장된 arrayBuffer Data로 Blob 생성
    const blob = new Blob([arr], { type: 'text/csv' });
    // streamSaver Library
    const fileStream = streamSaver.createWriteStream(
      `${makeFileName(fileInfo, tab)}.csv`,
      {
        size: blob.size,
      }
    );
    const readableStream = blob.stream();
    if (window.WritableStream && readableStream.pipeTo)
      // download
      return readableStream.pipeTo(fileStream);
  }}>
  다운로드
</button>
```

import React, { useState, useEffect, useRef, Fragment } from "react";
import LabelStudio from "label-studio";
import "label-studio/build/static/css/main.css";
import {
  Button,
  Upload,
  Input,
  Modal,
  Popconfirm,
  Typography,
  Collapse,
  Table,
  Image,
  message,
  Switch,
  Col
} from 'antd'
import {
  BugOutlined,
  DownloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  RocketOutlined,
  UploadOutlined,
  CheckOutlined,
  CloseOutlined,
  SaveOutlined,
  FileOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Column } = Table;

const border = {
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
}

const LabelStudioWrapper = (props) => {
  // we need a reference to a DOM node here so LSF knows where to render
  const rootRef = useRef();
  // this reference will be populated when LSF initialized and can be used somewhere else
  const lsfRef = useRef();
  const labelRef = useRef(true);

  const annotationArr = [];
  const [path, setPath] = useState();
  const [json4Training, setJson4Training] = useState();
  const [additionalLabels, setAdditionalLabels] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [checkValue, setCheckValue] = useState([])

  const [previewImage, setPreviewImage] = useState('https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png');
  const [previewTitle, setPreviewTitle] = useState('');
  const [urlImage, setUrlImage] = useState();
  const [selectDataId, setSelectDataId] = useState();
  const [labeledDataId, setLabeledDataId] = useState();
  const {
    getAccountTableData,
    accountData,
    loginInformation,
    detailsData,
    getDetailsData,
    uploadJsonFile,
    patchDetailsTableData,
    getJsonFile,
  } = props

  // we're running an effect on component mount and rendering LSF inside rootRef node
  useEffect(() => {
    getAccountTableData()
    getDetailsData()
    if (rootRef.current) {
      lsfRef.current = new LabelStudio(rootRef.current, {
        /* all the options according to the docs */
        config: `
          <View>
            <Image name="img" value="$image"></Image>
            <RectangleLabels name="tag" toName="img">
              ${additionalLabels}
            </RectangleLabels>
          </View>
        `,

        interfaces: [
          "panel",
          "update",
          "submit",
          "skip",
          "controls",
          "infobar",
          "topbar",
          "instruction",
          "side-column",
          "annotations:history",
          "annotations:tabs",
          "annotations:menu",
          "annotations:current",
          "annotations:add-new",
          "annotations:delete",
          "annotations:view-all",
          "predictions:tabs",
          "predictions:menu",
          "auto-annotation",
          "edit-history"
        ],

        user: {
          pk: 1,
          firstName: "Morris",
          lastName: "Chang"
        },

        task: {
          annotations: [],
          predictions: [],
          id: 1,
          data: {
            image: path
          }
        },

        onLabelStudioLoad: function (ls) {
          var c = ls.annotationStore.addAnnotation({
            userGenerate: true
          });
          ls.annotationStore.selectAnnotation(c.id);
          setPath(previewImage);
        },

        onSubmitAnnotation: (ls, annotation) => {
          // console.log('ls info: ', ls);
          // console.log('annotation info: ', annotation.serializeAnnotation());
          const originalWidth = annotation.serializeAnnotation().length > 0? annotation.serializeAnnotation()[0].original_width: null;
          const originalHeight = annotation.serializeAnnotation().length > 0? annotation.serializeAnnotation()[0].original_height: null;
          for (let index = 0; index < annotation.serializeAnnotation().length; index++) {
            const x_min = Math.round(annotation.serializeAnnotation()[index].original_width * (annotation.serializeAnnotation()[index].value.x / 100));
            const y_min = Math.round(annotation.serializeAnnotation()[index].original_height * (annotation.serializeAnnotation()[index].value.y / 100));
            const x_max_min = Math.round(annotation.serializeAnnotation()[index].original_width * (annotation.serializeAnnotation()[index].value.width / 100));
            const y_max_min = Math.round(annotation.serializeAnnotation()[index].original_height * (annotation.serializeAnnotation()[0].value.height / 100));
            const categoryId = additionalLabels.indexOf(
              `<Label value="${annotation.serializeAnnotation()[index].value.rectanglelabels[0]}"/>`
              );
            annotationArr.push(
              `{
                  "category_id": ${categoryId+1},
                  "bbox": [${x_min}.0, ${y_min}.0, ${x_max_min}.0, ${y_max_min}.0]
                }`
            );
          }
          setJson4Training(`
            {
              "image":
              {
                "file_name": "${previewTitle}",
                "width": ${originalWidth},
                "height": ${originalHeight}
              },
              "annotation":
              [
                ${annotationArr.length > 0? annotationArr: null}
              ]
            }
          `)
        },

        onUpdateAnnotation: (ls, annotation) => {
          // console.log('annotation info: ', annotation.serializeAnnotation());
          const originalWidth = annotation.serializeAnnotation().length > 0? annotation.serializeAnnotation()[0].original_width: null;
          const originalHeight = annotation.serializeAnnotation().length > 0? annotation.serializeAnnotation()[0].original_height: null;
          annotationArr.length = 0;
          for (let index = 0; index < annotation.serializeAnnotation().length; index++) {
            const x_min = Math.round(annotation.serializeAnnotation()[index].original_width * (annotation.serializeAnnotation()[index].value.x / 100));
            const y_min = Math.round(annotation.serializeAnnotation()[index].original_height * (annotation.serializeAnnotation()[index].value.y / 100));
            const x_max_min = Math.round(annotation.serializeAnnotation()[index].original_width * (annotation.serializeAnnotation()[index].value.width / 100));
            const y_max_min = Math.round(annotation.serializeAnnotation()[index].original_height * (annotation.serializeAnnotation()[0].value.height / 100));
            const categoryId = additionalLabels.indexOf(
              `<Label value="${annotation.serializeAnnotation()[index].value.rectanglelabels[0]}"/>`
              );
            annotationArr.push(
              `{
                  "category_id": ${categoryId+1},
                  "bbox": [${x_min}.0, ${y_min}.0, ${x_max_min}.0, ${y_max_min}.0]
                }`
            );
          }
          setJson4Training(`
            {
              "image":
              {
                "file_name": "${previewTitle}",
                "width": ${originalWidth},
                "height": ${originalHeight}
              },
              "annotation":
              [
                ${annotationArr.length > 0? annotationArr: null}
              ]
            }
          `)
        }
      }
      );
    }
  }, [ path, previewImage, previewTitle, additionalLabels ]);

  const WhichUser = accountData.filter((c) => {
    if(loginInformation.user || loginInformation.admin) {
      return c.username == loginInformation.username
    }else{
      return c
    }
})

  const handleInput = (e) => {
    setUrlImage(e.target.value);
  }

  const onAddImgUrl = () => {
    setPreviewImage(`https://d20cmf4o2f77jz.cloudfront.net/image/${urlImage}.jpg`);
    setPreviewTitle(urlImage+'.jpg');
  }

  const sendImageUrlButton = (
    !urlImage?
    <Button icon={<EyeInvisibleOutlined />} size="large" disabled />:
    <Button onClick={onAddImgUrl} icon={<EyeOutlined />} size="large" />
  )

  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  const exportToJson = () => {
    const jsonData = JSON.parse(json4Training)
    const fileName = previewTitle;
    const extIndex = fileName.lastIndexOf('.');
    const newFileName = extIndex != -1? fileName.substring(0, extIndex): fileName;
    downloadFile({
      data: JSON.stringify(jsonData),
      fileName: newFileName+'.json',
      fileType: 'text/json',
    })
    const labeled = { labeled: '1'}
    patchDetailsTableData(labeledDataId,labeled)
  }

  const crawler_onClick = () => {
    // const jsonData = JSON.parse(json4Training)
    // console.log('web crawler: ', jsonData)
    const fileName = previewTitle;
    const extIndex = fileName.lastIndexOf('.');
    const newFileName = extIndex != -1? fileName.substring(0, extIndex): fileName;
    if (!json4Training) {
      message.warning('Please label the image first !')
    } else {
      Modal.info({
        title: newFileName+'.json',
        content:(
          <div>
            <p>{json4Training}</p>
          </div>
        )
      });
    }
  }

  const onAddLabel = () => {
    if (labelRef.current.input.value != '') {
      const label = `<Label value="${labelRef.current.input.value}"/>`
      setAdditionalLabels((value) => [ ...value, label ]);
    } else {
      message.warning('Input Label Name cannot be empty !')
    }
  }

  const onReset = () => {
    setAdditionalLabels([]);
  }

  const FilterData = (value) => {
    const EachDetailData = detailsData.filter((e) => {
      return (
        loginInformation.user == true?
        e.Event.Device.Host.Project.User.id == value:
        e.details.slice(0,8)
      )
    })
    const CleanedData = EachDetailData.filter((data) => {
      return data.cleaned == '1'
    })
    return CleanedData
  }

  const handleUploadJson = {
    onRemove: (file) => {
      // console.log(file)
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      const labeled = { labeled: '0' }
      patchDetailsTableData(selectDataId, labeled)
    },
    beforeUpload: (file) => {
      file.status = 'done'
      // console.log(file)
      setFileList([...fileList, file]);
      const labeled = { labeled: '1' }
      patchDetailsTableData(selectDataId, labeled)
      return false;
    },
    // fileList,
  }

  const uploadJson = (id) => {
    checkValue.map((element) => {
      patchDetailsTableData(element.id, value2json(element))
    })
    setCheckValue([])
    if(fileList.length > 0){
      uploadJsonFile(fileList[0])
      setFileList([])
      patchDetailsTableData(id, { json: '1' })
    }
  }

  const value2json = (value) => {
    if(typeof(value.json) === 'boolean'){
      if(value.json == true){
        const json = { json: '1' }
        return json
      }else{
        const json = { json: '0' }
        return json
      }
    }else if(typeof(value.labeled) === 'boolean'){
      if(value.labeled == true){
        const labeled = { labeled: '1' }
        return labeled
      }else{
        const labeled = { labeled: '0' }
        return labeled
      }
    }
  }

  const viewJsonFile = (text) => {
    getJsonFile(text.details)
  }

  const checkCleaned = (text) => {
    if (text.cleaned == true) {
        return (
          <CheckOutlined />
        )
    } else {
        return (
          <CloseOutlined />
        )
    }
  }

  const checkLabeled = (text) => {
    if (text == true) {
        return (
          <CheckOutlined />
        )
    } else {
        return (
          <CloseOutlined />
        )
    }
  }

  const checkJson = (text, record) => {
    return(
      <Fragment>
        <Col>
        {
          text == true?
          <Button
            type="primary"
            style={{ margin: 2, ...border }}
            icon={<FileOutlined />}
            onClick={() => {viewJsonFile(record)}}
          >
            Check JSON File
          </Button>:
          <Button
            type="primary"
            style={{ margin: 2, ...border }}
            icon={<FileOutlined />}
            disabled
          >
            Check JSON File
          </Button>
        }

        </Col>
      </Fragment>
    )
  }

  const actionBtn = (data) => {
    return(
      <div>
        <div style={{ margin: 18 }}>
          <Button
            style={{ margin: 2, ...border }}
            type="primary"
            icon={<RocketOutlined />}
            onClick={() => {
              setUrlImage(data.details)
              setLabeledDataId(data.id)
            }}
          >
            Send to Input
          </Button>
        </div>
        <div style={{ margin: 18 }}>
          <Upload {...handleUploadJson} showUploadList={fileList.length} maxCount={1}>
            <Button
              style={{ margin: 2, ...border }}
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => {
                setFileList([])
                setSelectDataId(data.id)
              }}
            >
              Upload JSON
            </Button>
          </Upload>
          <Button
            type="primary"
            style={{ margin: 2, ...border }}
            icon={<SaveOutlined />}
            onClick={() => {
              uploadJson(data.id)
            }}
          >
            Save to S3
          </Button>
        </div>
      </div>
    )
  }

  const findImageByDetail = (text) => {
    return (
      <Fragment align='center'>
        <Image
          style={{ margin: 2, ...border }}
          src={`https://d20cmf4o2f77jz.cloudfront.net/image/${text.details}.jpg`}
          width='40%'
          height='40%'
        />
        <Text>{text.details}</Text>
      </Fragment>
    )
  }

  // just a wrapper node to place LSF into
  return (
    <Fragment>
      <Collapse accordion style={{ margin: 5, backgroundColor: 'lightgray' }}>
        <Panel header='Data Store' key={'1'}>
          <span style={{ margin: 5 }}>
            <Input
              allowClear
              type="text"
              size="large"
              addonBefore="../S3/Image/"
              placeholder="Input Filename ..."
              style={{ height: 30, width: '50%' }}
              onChange={handleInput}
              value={ urlImage? urlImage: ''}
            />
            {sendImageUrlButton}
          </span>
          <Table
            style={{ margin: 5 }}
            dataSource={FilterData(WhichUser[0].id)}
            pagination={{ position: ['bottomCenter'], defaultCurrent: 1, defaultPageSize: 5 }}
            scroll={{ y: 220 }}
          >
            <Column
              title='Data'
              align="center"
              render={findImageByDetail}
              width='30%'
            />
            <Column
                title='cleaned'
                render={checkCleaned}
                align='center'
                width='15%'
            />
            <Column
                title='labeled'
                render={checkLabeled}
                dataIndex='labeled'
                key='labeled'
                align='center'
                width='15%'
            />
            <Column
              title='json'
              render={checkJson}
              dataIndex='json'
              key='json'
              align='center'
              width='15%'
            />
            <Column
              title='Action'
              align="center"
              render={actionBtn}
              width='15%'
            />
          </Table>
        </Panel>
      </Collapse>
      <div style={{ margin: 5 }}>
        <Title level={3} style={{ color: 'white' }}>Label Workspace</Title>
        <Input
          allowClear
          type="text"
          placeholder="Input Label Name ..."
          style={{ height: 32, width: 180, ...border }}
          ref={labelRef}
        />
        <Button
          type='primary'
          onClick={onAddLabel}
          style={{ marginLeft: 5, ...border }}
          icon={<PlusOutlined />}
        >
          Add Label
        </Button>
        <Popconfirm
          title='Clean all Labels ?'
          onConfirm={onReset}
        >
          <Button
            type='primary'
            danger
            style={{ marginLeft: 3, ...border }}
            icon={<DeleteOutlined />}
          >
            Delete Labels
          </Button>
        </Popconfirm>
        <Button
          type='primary'
          onClick={crawler_onClick}
          style={{ marginLeft: 3, ...border }}
          icon={<BugOutlined />}
        >
          View JSON
        </Button>
        {
          json4Training?
          <Button
            type="primary"
            onClick={exportToJson}
            style={{ marginLeft: 3, ...border }}
            icon={<DownloadOutlined />}
          >
            Download JSON
          </Button>:
          <Button
            style={{ marginLeft: 3, ...border }}
            icon={<DownloadOutlined />}
            disabled
          >
            Download JSON
          </Button>
        }
      </div>
      <div style={{ margin: 5 }} ref={rootRef} />
    </Fragment>
  );
};


export default (LabelStudioWrapper)
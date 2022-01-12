import React, { useState } from 'react'
import { View , Text , TouchableOpacity, StyleSheet , ProgressBarAndroid} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import FormData from 'form-data';
import axios from 'axios';

const UploadFiles = () => {
    let [fileName , setFileName] = useState();
    let [filePath , setFilePath] = useState();
    let [fileSize , setFileSize] = useState();
    let [progressState , setProgressState] = useState(false)
    let [fileObj , setFileObj] = useState()

      let options = {
        title: 'Video Picker', 
        mediaType: '', 
        storageOptions:{
          skipBackup:true,
          path:'images'
        }
  };

    async function selectFileFunc(){
        const result = await launchImageLibrary(options,(response)=>{
            setProgressState(true)
            console.log('Response = ', response);
            if (response.didCancel) {
              alert('cancelled to be picked');
              setProgressState(false)
            } else if (response.error) {
                alert('ImagePicker Error: ', response.error);
                setProgressState(false)
            } else if (response.customButton) {
                alert('User tapped custom button: ', response.customButton);
                setProgressState(false)
            } else {
              setFileName(response.assets[0].fileName);
              setFilePath(response.assets[0].uri);
              setFileSize(response.assets[0].fileSize);
              setFileObj(response.assets[0])
              setTimeout(() => {
                setProgressState(false)
              }, 1000);
            }
        });
    }

    async function uploadFileFunc(){
        let data = new FormData();
        data.append("file", fileObj);
        try {
           if(fileObj){
            const response = await axios.post("https://ipfs-dev.ternoa.dev/api/v0/add" + `/thumbnail`, data, {
                headers: {
                  accept: "application/json",
                  "Accept-Language": "en-US,en;q=0.8",
                  "Content-Type": `multipart/form-data; boundary=${data._boundary} `,
                },
              });
              console.log(response.data)
              if(response.data){
                  alert("Upload SuccessFully")
                    setFileName("");
                    setFilePath("");
                    setFileSize("");
                    setFileObj("")
              }
           }else{
               alert("Nothing Selected")
           }
        } catch (error) {
            alert("Some Thing Went Wrong")
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
                {
                    fileName && filePath && fileSize ? (
                        <View style={styles.info}>
                            <Text style={styles.para}>File Name : {fileName}</Text>
                            <Text style={styles.para}>File Path : {filePath}</Text>
                            <Text style={styles.para}>File Size : {fileSize}</Text>
                        </View>
                    ) : (
                        <View>
                            <Text>Nothing Selected</Text>
                        </View>
                    )
                }
            <View style={styles.selectBtn}>
                <TouchableOpacity onPress={selectFileFunc} style={styles.pressBtn}><Text>Select File</Text></TouchableOpacity>
            </View>
            <View style={styles.progressBar}>
                {
                    progressState === true ? 
                    (
                        <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" style={styles.bar} />
                    ) 
                    : 
                    (
                        null
                    )
                }
            </View>
            <View style={styles.uploadBtn}>
                <TouchableOpacity onPress={uploadFileFunc} style={styles.pressBtn}><Text>Upload Selected File</Text></TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    info : {
        paddingLeft:20,
    },
    para : {
        fontWeight:"bold",
        fontSize:15
    },
    selectBtn : {
        marginTop:40
    },
    pressBtn : {
        borderWidth:1,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:20,
        paddingRight:20,
        borderColor:'blue'
    },
    progressBar : {
        paddingTop : 40,
        width:170,
    },
    bar : {
        padding:30
    }
})

export default UploadFiles;

import { useRequest } from 'umi';
import { getRumorData, onHandleRumor } from '@/services/rumor.js';

interface Item {
  id?: string;
  text: string;
  time: number;
  percent: number;
}

interface Result {
  list: Item[];
}

let dataCache = []
let highPercent = []
let handled = []
let wordCouldData = []
let index = 0;
let percent = 0.5

export default function rumorDetect(scrollListToEnd) {

  const { data, loading } = useRequest(() => { return getRumorData(index) },
    {
      pollingWhenHidden: false,
      pollingInterval: 1000,
      cacheKey: 'rumor_cache_key',
      onSuccess: (data, params) => {
        index++;
        data.data.forEach(element => {
          dataCache.push(element);
          dataCache = [...dataCache]
          if (element.percent >= percent) {
            if(element.handled == false)
            {
              highPercent.push(element);
              highPercent = [...highPercent]
            }
            else
            {
              handled.push(element);
              handled = [...handled]
            }
            wordCouldData = getWordData()
          }
        });
        if(scrollListToEnd != null)
          scrollListToEnd();
      }
    }
  );

  const handleRumor = async (id, isRumor, callback) => {
    try {
      console.log(id)
      await onHandleRumor(id, isRumor).then(() => {

        for (let i = highPercent.length - 1; i >= 0; i--) {
          if (highPercent[i].id == id) {
            highPercent[i].confirm = isRumor;
            handled.push(highPercent[i])
            highPercent.splice(i, 1);
            break;
          }
        }

        for (let i = dataCache.length - 1; i >= 0; i--) {
          if (dataCache[i].id == id) {
            dataCache[i].handled = 1;
            dataCache[i].confirm = isRumor;
            break;
          }
        }

        highPercent = [...highPercent]
        handled = [...handled]
        dataCache = [...dataCache]
        wordCouldData = getWordData()
        if(callback != null)
          callback();
      });
    } catch (error) {
    }
  };

  const setPercent = (value) => {
    console.log(value)
    percent = value;
    highPercent = []
    dataCache.forEach(element => {
      if (element.percent >= percent) {
        if(element.handled == false)
        {
          highPercent.push(element);
        }
        else
        {
          handled.push(element);
        }
      }
    });
    handled = [...handled]
    highPercent = [...highPercent]
    dataCache = [...dataCache]
    wordCouldData = getWordData()
  }

  const getWordData = () => {
    let map = {};
    highPercent.forEach(element => {
      element.analyzedWords.forEach(word => {
        if (word in map) {
          map[word] += 1;
        }
        else {
          map[word] = 1;
        }
      });
    });
    handled.forEach(element => {
      element.analyzedWords.forEach(word => {
        if (word in map) {
          map[word] += 1;
        }
        else {
          map[word] = 1;
        }
      });
    });

    let temp = [];
    for (var key in map) {
      temp.push({ "value": map[key], "name": key },)
    }
    temp.sort((left, right)=>{
      return -(left["value"] - right["value"])
    })
    let count = temp.length;
    let result = []
    if(count >= 50) count = 50;
    for(let i = 0; i < count; i++)
    {
      result.push(temp[i]);
    }
    return result;
  }

  return {
    dataSource: dataCache,
    highPercent: highPercent,
    loading: loading,
    handleRumor: handleRumor,
    setPercent: setPercent,
    wordCouldData: wordCouldData,
    handled : handled
  };

}
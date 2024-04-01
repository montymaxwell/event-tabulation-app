import * as XLSX from 'xlsx';
import { useEffect, useState } from "react"
import { Text, View, ScrollView } from "react-native"

import { useEventForm, useScores } from "@/lib/store"

type MinorCriteria = Array<{
  name: string, 
  data: Array<{ 
    total: number, 
    name: string, 
    scores: Array<{ judge: number, score: number }> 
  }>
}>

type TGeneralCriteria = Array<{
  name: string, 
  data: Array<{
    total: number, 
    judge: number,
    scores: Array<{ judge: number, score: number }> 
  }>
}>

type GeneralCriteria = Array<{
  criteria: number, // criteria index
  candidate: number, // candidate index
  total: number,
  data: Array<{
    judge: number,
    score: number
  }>
}>

function ResultsPage () {
  const event = useEventForm((state) => state.value)
  const scores = useScores((state) => state.value)

  const [minorCriteria, setMinorCriteria] = useState<MinorCriteria>([])
  const [generalCriteria, setGeneralCriteria] = useState<GeneralCriteria>([])

  useEffect(() => {
    const dataMinor: MinorCriteria = [];
    const dataGeneral: GeneralCriteria = [];

    event.category.forEach(d => {
      dataMinor.push({ name: d.name, data: [] });
    });

    scores.forEach((judge, j) => {
      judge.candidates.forEach((data, c) => {
        data.category.forEach((num, i) => {
          if (dataMinor[i].data[c] === undefined) {
            dataMinor[i].data[c] = {
              total: 0,
              name: data.candidate,
              scores: []
            }
          }

          dataMinor[i].data[c].total += num;
          dataMinor[i].data[c].scores[j] = { judge: j, score: num }
          if (dataMinor[i].data[c].scores.length === data.category.length) {
            const target = dataMinor[i].data[c];
            dataMinor[i].data[c].total = Math.round((target.total / target.scores.length + Number.EPSILON) * 100) / 100;
          }
        })

        
        data.criterias.forEach((num, i) => {
          // if (dataGeneral[c] === undefined) {
          //   dataGeneral[c] = {
          //     candidate: c,
          //     criteria: i,
          //     total: 0,
          //     data: []
          //   }
          // }

          // if (generalCriteria[c].data[i] === undefined) {
          //   generalCriteria[c].data[i] = { judge: j, score: num };
          // }

          // if (dataGeneral[c] === undefined) {
          //   dataGeneral[c] = {
          //     name: data.candidate,
          //     data: []
          //   }
          // }

          // if (dataGeneral[c].data[i] === undefined) {
          //   dataGeneral[c].data[i] = {
          //     total: 0,
          //     judge: 0,
          //     scores: []
          //   }
          // }

          // dataGeneral[c].data[i].total += num;
          // dataGeneral[c].data[i].judge = j;
          // dataGeneral[c].data[i].scores[j] = { judge: j, score: num };
          // if (dataGeneral[c].data[i].scores.length === data.criterias.length) {
          //   const target = dataGeneral[c].data[i];
          //   dataGeneral[c].data[i].total = Math.round((target.total / target.scores.length + Number.EPSILON) * 100) / 100;
          // }
        })
      })
    });

    dataMinor.forEach((category) => {
      category.data.sort((v1, v2) => v1.total - v2.total);
      category.data.reverse();
    })

    setMinorCriteria(dataMinor);
    setGeneralCriteria(dataGeneral);

    const book = XLSX.utils.book_new();
    dataMinor.forEach((criteria, ci) => {
      const renderable_data = []
      renderable_data.push([criteria.name])
      
      criteria.data.forEach((data, i) => {
        let total = 0;
        const row: Array<any> = [];
        row.push(data.name);
        data.scores.forEach((score, s) => {
          total += score.score;
          row.push(score.score);
        })
        
        renderable_data.push(row);
      })

      
      console.log(renderable_data);
    })


    const sheet = XLSX.utils.aoa_to_sheet([

      ["", ""]
    ])

  }, [])

  return (
    <ScrollView>
      <Text>{event.name}</Text>
      {minorCriteria.map((criteria, ci) => (
        <View key={ci} className="p-5">
          <Text>Criteria: {criteria.name}</Text>
          <View>
            {criteria.data.map((data, di) => (
              <View key={di} className="w-full flex-row flex-wrap justify-around border my-0.5 border-red-500">
                <Text className="flex-auto mx-1 p-2 border-x border-blue">{data.name}</Text>
                {data.scores.map((score, si) => (
                  <Text key={si} className="flex-auto mx-1 p-2 border-x border-blue text-center">{String(score.score)}</Text>
                ))}
                <Text className="flex-auto mx-1 p-2 border-x border-blue text-center">{data.total}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
      {/* {generalCriteria.map((criteria, ci) => (
        <View key={ci} className="p-5">
          {criteria.data.map((data, i) => (
            <View key={i} className="w-full flex-row flex-wrap justify-around border my-0.5 border-red-500">
              <Text className="flex-auto mx-1 p-2 border-x border-blue text-center">{data.total}</Text>
              <Text>{scores[data.judge].label}</Text>
            </View>
          ))}
        </View>
      ))} */}
    </ScrollView>
  )
}

export default ResultsPage

      // {minorCriteria.map((v, i) => (
      //   <View key={i} className="border">
      //     {/* <Text>{JSON.stringify(v, null, 8)}</Text> */}
      //     {v.data.map((d, j) => (
      //       <View key={j} className="border">
      //         <Text>{d.name}</Text>
      //       </View>
      //     ))}
      //   </View>
      // ))}
import * as XLSX from 'xlsx';
import Button from "@/components/Button";
import { useEventForm, useScores } from "@/lib/store";
import { useEffect, useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";

type MinorCriteria = {
  name: string,
  data: Array<{
    name: string,
    total: number,
    average: number,
    scores: Array<{
      judge: {
        id: string,
        label: string,
        index: number
      },
      value: number
    }>
  }>
}

export default function DocumentPage () {
  const event = useEventForm((state) => state.value)
  const scores = useScores((state) => state.value)

  const [minorCriteria, setMinorCriteria] = useState<{
    event: string,
    raw: Array<Array<Array<number>>>,
    structured: Array<MinorCriteria>
  }>()

  const [generalCriteria, setGeneralCriteria] = useState([])

  useEffect(() => {
    const structured_data_minor: Array<MinorCriteria> = []
    const raw_data_minor: Array<Array<Array<number>>> = [];

    scores.forEach((score, scoreIndex) => {
      score.candidates.forEach((entry, entryIndex) => {
        entry.category.forEach((category, categoryIndex) => {
          if (raw_data_minor[categoryIndex] === undefined) {
            raw_data_minor[categoryIndex] = [];
            structured_data_minor[categoryIndex] = {
              name: event.category[categoryIndex].name,
              data: []
            }
          }

          if (raw_data_minor[categoryIndex][entryIndex] === undefined) {
            raw_data_minor[categoryIndex][entryIndex] = [];
            structured_data_minor[categoryIndex].data[entryIndex] = {
              name: entry.candidate,
              total: 0,
              average: 0,
              scores: []
            }
          }

          raw_data_minor[categoryIndex][entryIndex][scoreIndex] = category;
          structured_data_minor[categoryIndex].data[entryIndex].total += category;
          structured_data_minor[categoryIndex].data[entryIndex].scores[scoreIndex] = {
            judge: {
                id: score.owner,
                label: score.label,
                index: scoreIndex
            },
            value: category
          }

          if (raw_data_minor[categoryIndex][entryIndex].length === entry.category.length) {
            const s = structured_data_minor[categoryIndex].data[entryIndex];
            const average = Math.round(((s.total / s.scores.length) + Number.EPSILON) * 100) / 100;
            structured_data_minor[categoryIndex].data[entryIndex].average = average;
            raw_data_minor[categoryIndex][entryIndex][raw_data_minor[categoryIndex][entryIndex].length] = s.total;
            raw_data_minor[categoryIndex][entryIndex][raw_data_minor[categoryIndex][entryIndex].length] = average;
          }
        });
      })
    });

    setMinorCriteria({
      event: event.id,
      raw: raw_data_minor,
      structured: structured_data_minor,
    });

  }, [])

  const GenerateFinalOutput = () => {
    if (Platform.OS === 'web') {
      window.print();
    }

    if (minorCriteria) {
      // first array = sheet
      // second array = criteria
      // third array = data

      const book = XLSX.utils.book_new();
      minorCriteria.raw.forEach((row, r) => {
        const table: any = [];
        
        
        row.forEach((row2, r2) => {
          if (r2 === 0) {
            table[r2] = [["best in " + minorCriteria.structured[r].name]];
            table[r2 + 1] = [["Candidates"]]
          }

          table.push([]);

          row2.forEach((col, c) => {
            if (r2 == 1) {
              if (minorCriteria.structured[0].data[0].scores[c] !== undefined) {
                table[r2].push(minorCriteria.structured[0].data[0].scores[c].judge.label);
              }
            }

            if (c === 0) {
              table[r2 + 2][c] = minorCriteria.structured[r].data[r2].name;
            }

            table[r2 + 2].push(String(col));
          });
        });

        table[1].push("total");
        table[1].push("average");

        XLSX.utils.book_append_sheet(
          book, 
          XLSX.utils.aoa_to_sheet(table), 
          minorCriteria.structured[r].name, 
          true
        );
      });

      
      if (Platform.OS === 'web') {
        XLSX.writeFile(book, "data.xlsx", { compression: true });

        return;
      }
    }
  }

  return (
    <ScrollView className="flex-auto">
      <View className="w-full">
        {minorCriteria ? minorCriteria.structured.map((score, scoreIndex) => (
          <View key={'score-'+scoreIndex} className="w-full p-3 my-2">
            <View className="w-full mb-2">
              <Text>{score.name}</Text>
            </View>
            {score.data.map((data, index) => (
              <>
                {index === 0 ?
                  <View key={'header-'+index} className="w-full flex-row flex-nowrap">
                    <View className="flex-auto items-center border">
                      <Text>Candidates</Text>
                    </View>
                    {data.scores.map((e, i) => {
                      const text = e.judge.label.split("");
                      text[0] = text[0].toUpperCase();

                      return (
                        <View key={i} className="w-10 flex-auto items-center border">
                          <Text>{text.join('')}</Text>
                        </View>
                      )
                    })}
                    <View className="w-10 flex-auto items-center border">
                      <Text>Average</Text>
                    </View>
                  </View>
                  :
                  <></>
                }
                <View key={'entry-'+index} className="w-full flex-row flex-nowrap">
                  <View className="flex-auto items-center border">
                    <Text>{data.name}</Text>
                  </View>
                  {data.scores.map((e, i) => (
                    <View key={i} className="w-10 flex-auto items-center border">
                      <Text>{e.value}</Text>
                    </View>
                  ))}
                  <View className="w-10 flex-auto items-center border">
                    <Text>{data.average}</Text>
                  </View>
                </View>
              </>
            ))}
          </View>
        )) : <></>}
      </View>
      <View className="w-full p-3 mt-5 results-view">
        <Button
          label="Generate Output"
          onPress={GenerateFinalOutput}
        />
      </View>
    </ScrollView>
  )
}
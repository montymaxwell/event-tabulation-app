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

type Data = Array<{
  name: string,
  average: number,
  scores: Array<number>
}>

export default function DocumentPage () {
  const event = useEventForm((state) => state.value)
  const scores = useScores((state) => state.value)

  const [minorCriteria, setMinorCriteria] = useState<{
    event: string,
    raw: Array<Array<Array<number>>>,
    structured: Array<MinorCriteria>
  }>()

  const [generalCriteria, setGeneralCriteria] = useState<{
    event: string,
    structured: Data,
    top10: Data,
    top5: Data
  }>()

  useEffect(() => {
    const structured_data_minor: Array<MinorCriteria> = []
    const raw_data_minor: Array<Array<Array<number>>> = [];

    const structured_data_gen: Array<any> = [];

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

          if (raw_data_minor[categoryIndex][entryIndex].length === scores.length) {
            const s = structured_data_minor[categoryIndex].data[entryIndex];
            const average = Math.round(((s.total / scores.length) + Number.EPSILON) * 100) / 100;
            structured_data_minor[categoryIndex].data[entryIndex].average = average;
            raw_data_minor[categoryIndex][entryIndex][raw_data_minor[categoryIndex][entryIndex].length] = s.total;
            raw_data_minor[categoryIndex][entryIndex][raw_data_minor[categoryIndex][entryIndex].length] = average;
          }
        });

        if (structured_data_gen[entryIndex] === undefined) {
          structured_data_gen[entryIndex] = {
            name: entry.candidate,
            average: 0,
            scores: []
          }
        }
        
        let total = 0;
        entry.criterias.forEach((v, i) => {
          total += v;

          if ((entry.criterias.length - 1) > 0) {
            if (i === (entry.criterias.length - 1)) {
              structured_data_gen[entryIndex].average += total;
            }
          }
          else {
            structured_data_gen[entryIndex].average += total;
          }
        });
        
        structured_data_gen[entryIndex].scores[scoreIndex] = total;
        if (structured_data_gen[entryIndex].scores.length === scores.length) {
          structured_data_gen[entryIndex].average = Math.round(((structured_data_gen[entryIndex].average / scores.length) + Number.EPSILON) * 100) / 100;
        }
      });
    });

    structured_data_gen.sort((a, b) =>  (a.average - b.average)).reverse();

    structured_data_minor.forEach((v, i) => {
      v.data.sort((a, b) => a.average - b.average).reverse();
    })
    raw_data_minor.forEach((v, i) => {
      v.sort((a, b) => (a[a.length - 1] - b[b.length - 1])).reverse();
    })

    setMinorCriteria({
      event: event.id,
      raw: raw_data_minor,
      structured: structured_data_minor,
    });

    const top10: Array<any> = [];
    const top5: Array<any> = [];

    let i = 0;
    while(i < 10) {
      if (top5.length < 5) {
        top5[i] = structured_data_gen[i];
      }

      top10[i] = structured_data_gen[i];
      i++;
    }

    setGeneralCriteria({
      event: event.id,
      structured: structured_data_gen,
      top10: top10,
      top5: top5
    })

  }, [])

  const GenerateFinalOutput = () => {
    // if (Platform.OS === 'web') {
    //   window.print();
    // }

    if (minorCriteria && generalCriteria) {
      // first array = sheet
      // second array = criteria
      // third array = data

      const book = XLSX.utils.book_new();
      minorCriteria.raw.forEach((row, r) => {
        const table: Array<any> = [];
        
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

          table[r2 + 2].push(String(r2 + 1));
        });

        table[1].push("Total");
        table[1].push("Average");
        table[1].push("Ranking");

        XLSX.utils.book_append_sheet(
          book, 
          XLSX.utils.aoa_to_sheet(table), 
          minorCriteria.structured[r].name, 
          true
        );
      });

      const table2: Array<any> = [];
      const top10: Array<any> = [];
      const top5: Array<any> = [];

      generalCriteria.structured.forEach((entry, entryIndex) => {
        if(entryIndex === 0) {
          table2[entryIndex] = ["General Criteria"]
          top10[entryIndex] = ["Top 10"];
          top5[entryIndex] = ["Top 5"];

          table2[entryIndex + 1] = ["Candidates"]
          top10[entryIndex + 1] = ["Candidates"]
          top5[entryIndex + 1] = ["Candidates"]
          

          scores.forEach((v) => {
            const text = v.label.split("");
            text[0] = text[0].toUpperCase();
            table2[entryIndex + 1].push(text.join(''));
            top10[entryIndex + 1].push(text.join(''));
            top5[entryIndex + 1].push(text.join(''));
          })

          table2[entryIndex + 1].push("Average");
          table2[entryIndex + 1].push("Ranking");

          top10[entryIndex + 1].push("Average");
          top10[entryIndex + 1].push("Ranking");

          top5[entryIndex + 1].push("Average");
          top5[entryIndex + 1].push("Ranking");
        }

        if (table2[entryIndex + 2] === undefined) {
          table2[entryIndex + 2] = [];
        }

        entry.scores.forEach((score, i) => {
          if (i === 0) {
            table2[entryIndex + 2][i] = entry.name;
          }

          table2[entryIndex + 2].push(String(score));
          
          if (i === (entry.scores.length - 1)) {
            table2[entryIndex + 2].push(entry.average);
            table2[entryIndex + 2][entry.scores.length + 1] = String(entry.average);
          }
        });
        
        table2[entryIndex + 2].push(String(entryIndex + 1));
      });

      let i = 0;
      while(i < 10) {
        if (top5.length < 7) {
          top5[i + 2] = table2[i + 2];
        }

        top10[i + 2] = table2[i + 2];
        i++;
      }

      // top10[0][0] = "Top 10";
      // top5[0][0] = "Top 5";

      XLSX.utils.book_append_sheet(
        book, 
        XLSX.utils.aoa_to_sheet(table2), 
        "General Criteria", 
        true
      );

      XLSX.utils.book_append_sheet(
        book, 
        XLSX.utils.aoa_to_sheet(top10), 
        "Top 10", 
        true
      );

      XLSX.utils.book_append_sheet(
        book, 
        XLSX.utils.aoa_to_sheet(top5), 
        "Top 5", 
        true
      );
      
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
            <View key={'score-name-'+scoreIndex} className="w-full mb-2">
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
                        <View key={'th-'+i} className="w-10 flex-auto items-center border">
                          <Text>{text.join('')}</Text>
                        </View>
                      )
                    })}
                    <View key={'minor-average-'+index} className="w-10 flex-auto items-center border">
                      <Text>Average</Text>
                    </View>
                    <View key={'minor-ranking-'+index} className="w-10 flex-auto items-center border">
                      <Text>Ranking</Text>
                    </View>
                  </View>
                  :
                  <></>
                }
                <View key={'entry-'+index} className="w-full flex-row flex-nowrap">
                  <View key={'name-'+index} className="flex-auto items-center border">
                    <Text>{data.name}</Text>
                  </View>
                  {data.scores.map((e, i) => (
                    <View key={'score-'+i} className="w-10 flex-auto items-center border">
                      <Text>{e.value}</Text>
                    </View>
                  ))}
                  <View key={'average-'+index} className="w-10 flex-auto items-center border">
                    <Text>{data.average}</Text>
                  </View>
                  <View key={'ranking-'+index} className="w-10 flex-auto items-center border">
                    <Text>{index + 1}</Text>
                  </View>
                </View>
              </>
            ))}
          </View>
        )) : <></>}
        {generalCriteria ?
          <View className="w-full p-3 my-2">
            <View className="w-full my-2">
              <Text>General Average</Text>
            </View>
            {generalCriteria.structured.map((data, i) => (
              <>
                {i === 0 ?
                  <View key={'th-'+i} className="w-full flex-row">
                    {scores.map((v, e) => {
                      const text = v.label.split("");
                      text[0] = text[0].toUpperCase();

                      return (
                        <>
                          {e === 0 ?
                            <View key={'header-'+e} className="w-10 flex-auto items-center border">
                              <Text>Candidates</Text>
                            </View>
                            :
                            <></>
                          }
                          <View key={'head-'+e} className="w-10 flex-auto items-center border">
                            <Text>{text}</Text>
                          </View>
                        </>
                      )
                    })}
                    <View key={"gen-average-"+i} className="w-10 flex-auto items-center border">
                      <Text>Average</Text>
                    </View>
                    <View key={"gen-ranking-"+i} className="w-10 flex-auto items-center border">
                      <Text>Ranking</Text>
                    </View>
                  </View>
                  :
                  <></>
                }
                <View key={'row'+i} className="w-full flex-row">
                  {data.scores.map((score, s) => (
                    <>
                      {s === 0 ? 
                        <View key={'label'+i} className="w-10 flex-auto items-center border">
                            <Text>{scores[s].candidates[i].candidate}</Text>
                        </View>
                        :
                        <></>
                      }
                      <View key={'score'+s} className="w-10 flex-auto items-center border">
                        <Text>{score}</Text>
                      </View>
                    </>
                  ))}
                  <View key={'average-'+i} className="w-10 flex-auto items-center border">
                    <Text>{data.average}</Text>
                  </View>
                  <View key={'ranking-'+i} className="w-10 flex-auto items-center border">
                    <Text>{i + 1}</Text>
                  </View>
                </View>
              </>
            ))}
            <View className="w-full my-2">
              <Text>Top 10</Text>
            </View>
            {generalCriteria.top10.map((data, i) => (
              <>
                {i === 0 ?
                  <View key={'th-'+i} className="w-full flex-row">
                    {scores.map((v, e) => {
                      const text = v.label.split("");
                      text[0] = text[0].toUpperCase();

                      return (
                        <>
                          {e === 0 ?
                            <View key={'header-'+e} className="w-10 flex-auto items-center border">
                              <Text>Candidates</Text>
                            </View>
                            :
                            <></>
                          }
                          <View key={'head-'+e} className="w-10 flex-auto items-center border">
                            <Text>{text}</Text>
                          </View>
                        </>
                      )
                    })}
                    <View key={"gen-average-"+i} className="w-10 flex-auto items-center border">
                      <Text>Average</Text>
                    </View>
                    <View key={"gen-ranking-"+i} className="w-10 flex-auto items-center border">
                      <Text>Ranking</Text>
                    </View>
                  </View>
                  :
                  <></>
                }
                <View key={'row'+i} className="w-full flex-row">
                  {data.scores.map((score, s) => (
                    <>
                      {s === 0 ? 
                        <View key={'label'+i} className="w-10 flex-auto items-center border">
                            <Text>{scores[s].candidates[i].candidate}</Text>
                        </View>
                        :
                        <></>
                      }
                      <View key={'score'+s} className="w-10 flex-auto items-center border">
                        <Text>{score}</Text>
                      </View>
                    </>
                  ))}
                  <View key={'average-'+i} className="w-10 flex-auto items-center border">
                    <Text>{data.average}</Text>
                  </View>
                  <View key={'ranking-'+i} className="w-10 flex-auto items-center border">
                    <Text>{i + 1}</Text>
                  </View>
                </View>
              </>
            ))}
            <View className="w-full my-2">
              <Text>Top 5</Text>
            </View>
            {generalCriteria.top5.map((data, i) => (
              <>
                {i === 0 ?
                  <View key={'th-'+i} className="w-full flex-row">
                    {scores.map((v, e) => {
                      const text = v.label.split("");
                      text[0] = text[0].toUpperCase();

                      return (
                        <>
                          {e === 0 ?
                            <View key={'header-'+e} className="w-10 flex-auto items-center border">
                              <Text>Candidates</Text>
                            </View>
                            :
                            <></>
                          }
                          <View key={'head-'+e} className="w-10 flex-auto items-center border">
                            <Text>{text}</Text>
                          </View>
                        </>
                      )
                    })}
                    <View key={"gen-average-"+i} className="w-10 flex-auto items-center border">
                      <Text>Average</Text>
                    </View>
                    <View key={"gen-ranking-"+i} className="w-10 flex-auto items-center border">
                      <Text>Ranking</Text>
                    </View>
                  </View>
                  :
                  <></>
                }
                <View key={'row'+i} className="w-full flex-row">
                  {data.scores.map((score, s) => (
                    <>
                      {s === 0 ? 
                        <View key={'label'+i} className="w-10 flex-auto items-center border">
                            <Text>{scores[s].candidates[i].candidate}</Text>
                        </View>
                        :
                        <></>
                      }
                      <View key={'score'+s} className="w-10 flex-auto items-center border">
                        <Text>{score}</Text>
                      </View>
                    </>
                  ))}
                  <View key={'average-'+i} className="w-10 flex-auto items-center border">
                    <Text>{data.average}</Text>
                  </View>
                  <View key={'ranking-'+i} className="w-10 flex-auto items-center border">
                    <Text>{i + 1}</Text>
                  </View>
                </View>
              </>
            ))}
          </View>
        : <></>}
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
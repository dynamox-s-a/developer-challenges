# Integração ROS — o que realmente existe

**ROS aqui é uma ponte de proveniência offline, não um stack robótico.** Não há `roscore`,
nó permanente, publisher em tempo real, Gazebo, RViz ou `tf`. O que existe é um script
Python que converte uma aquisição já ingerida em um `rosbag` e a reconstrói de volta, mais
uma ponte TypeScript que o executa. Tudo é **opcional**: nenhuma suíte convencional
depende disso.

| Artefato | Papel |
|---|---|
| [`simulation/sensor-twin/ros/rosbag_bridge.py`](../../../simulation/sensor-twin/ros/rosbag_bridge.py) | `to-bag` / `from-bag` usando `rosbag.Bag` — 100% offline |
| [`src/provenance.ts`](../../../simulation/sensor-twin/src/provenance.ts) | formato JSONL determinístico e a reconstrução do payload |
| [`src/rosbridge.ts`](../../../simulation/sensor-twin/src/rosbridge.ts) | monta `PYTHONPATH`/`LD_LIBRARY_PATH` e executa a ponte, sem `source` |
| [`test-ros/ros.roundtrip.spec.ts`](../../../simulation/sensor-twin/test-ros/ros.roundtrip.spec.ts) | round-trip completo contra API viva + Noetic |

## O que se prova com isso

```
aquisição confirmatória (já escolhida pelo supervisor)
   → JSONL canônico
   → rosbag (.bag)
   → JSONL reconstruído
   → payload remontado SÓ com o que está nos registros
   → Ajv real (contrato interno)
   → computePayloadFingerprint IDÊNTICO ao original
   → POST /api/telemetry-cycles → 200 duplicate:true → zero amostras novas
```

A afirmação é precisa: **um artefato ROS portátil pode sair e voltar sem mudar de
identidade semântica**. A identidade é o fingerprint recomputado sobre o payload
reconstruído — nunca os bytes do `.bag`, cujos metadados de container variam entre
execuções. A byte-identidade do JSONL canônico re-serializado é registrada apenas como
evidência secundária.

Distinção que o teste torna visível: a **confirmação** do supervisor é uma aquisição nova
(`201`); o **replay ROS** é reprodução (`200 duplicate:true`, com o mesmo fingerprint). São
coisas diferentes, e o sistema as distingue sozinho.

## Formato intermediário (JSONL)

Três tipos de registro, um por linha, serializados com a mesma canonicalização usada no
fingerprint:

| Registro | Conteúdo |
|---|---|
| `acquisition` | contexto completo: identidade (máquina, ponto, sensor, `resourceId`), plano de tópicos, chave de idempotência, fingerprint declarado e os blocos do payload reproduzidos **verbatim** |
| `series` | atributos de cada medição (grandeza, eixo, unidade) |
| `sample` | um datapoint (`timestamp`, `value`) |

O artefato é autocontido: a reconstrução monta o payload **apenas** com o que está nos
registros — zero engine, zero seed, nenhuma regeneração de sinal. Se o bag perdesse
informação, o fingerprint mudaria e o teste falharia.

O fingerprint gravado no registro é chamado de *declarado* de propósito: a prova **sempre**
recomputa a partir do conteúdo reconstruído. Um valor declarado que não bate é justamente o
que se quer detectar.

## Tópicos

| Tópico | Tipo ROS | Conteúdo |
|---|---|---|
| `/sensors/<id>/imu` | `sensor_msgs/Imu` | `linear_acceleration` = RMS janelado em g dos eixos x/y/z |
| `/sensors/<id>/temperature` | `sensor_msgs/Temperature` | graus Celsius |
| `/<machine>/rpm` | `std_msgs/Float64` | rotação |
| `/sensors/<id>/provenance` | `std_msgs/String` | envelope JSON (`acquisition` + `series`), com `origin: simulation` |

**Mapeamento didático declarado:** `sensor_msgs/Imu.linear_acceleration` carrega o **RMS
janelado** em g, não a aceleração instantânea que a mensagem normalmente transporta. Isso
está dito no cabeçalho da ponte e na proveniência — é uma escolha de transporte, não uma
afirmação de que o dado é um IMU bruto.

Não existem `/clock`, `/tf` nem `/joint_states`: eles pertenciam à visão com Gazebo, que
foi cortada ([`simulation-vs-real.md`](./simulation-vs-real.md)).

`origin = simulation` é obrigatório nas duas camadas e verificado na reconstrução: um
replay ROS **jamais** pode aparentar aquisição física. Nenhum segredo ou token entra no
artefato.

## Requisitos e limites

- ROS 1 **Noetic** (Ubuntu 20.04, Python 3.8) com `rosbag` e `sensor_msgs`, instalação
  padrão em `/opt/ros/noetic` (sobrescrevível por `TWIN_ROS_ROOT`). A ponte monta o
  ambiente sozinha; sem o runtime, ela falha com mensagem explícita em vez de silenciar.
- Sem ROS 2, sem `roscore`, sem nós, sem publicação ao vivo, sem visualização.
- O escopo é **uma** aquisição — a confirmatória escolhida pelo supervisor. O bag não
  representa a frota nem substitui o banco.
- Um bag versionado em `simulation/sensor-twin/artifacts/` serve de exemplo do formato; ele
  é resultado, não fonte.

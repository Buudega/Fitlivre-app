# FitLivre — auditoria das demonstrações de exercícios

Data da consulta: 27/10/2026. Escopo: os 21 movimentos presentes no catálogo de `index.html`.

## Resumo de decisão

O catálogo agora usa um modelo 3D autoral, articulado e procedural. A auditoria abaixo compara cada movimento às referências documentais e bibliotecas catalogadas; ela não certifica biomecânica nem equivalência de uma biblioteca externa, pois o protótipo não usa esses ativos. A busca OSS do ExerciseDB atualmente integrada não oferece licença para uso comercial. A biblioteca RepDB tem um conjunto com licença de uso comercial dentro de app (Standard, preço divulgado de US$499, pagamento único), personagem consistente, fundo transparente e GIF/WebP animado; a página de cobertura publica os nomes/IDs. A versão gratuita do RepDB autoriza uso comercial dentro do app com atribuição, mas contém imagens estáticas, não animações. A amostra animada gratuita é apenas para avaliação/projetos não comerciais.

Não foram copiados GIFs de TrainAI, repositórios de terceiros, prévias pagas, nem vídeos aleatórios de criadores. Uma animação de exercício só deve ser mostrada quando o movimento e os acessórios correspondem ao exercício prescrito.

## Auditoria movimento a movimento

Legenda: **Exata** = nome/movimento da biblioteca cobre o que o app prescreve; **Variação** = há diferenças visíveis de apoio, equipamento ou execução; **Sem correspondência segura** = não usar animação parecida como se fosse a mesma coisa.

| Exercício no FitLivre | Candidato publicado no catálogo RepDB | Resultado para a demonstração | Observação |
|---|---|---|---|
| Agachamento até a cadeira | `Bodyweight Squat` (`bodyweight-squat`) | Variação | Agachamento livre não mostra a cadeira como alvo; não é demonstração exata da versão até sentar/tocar cadeira. |
| Agachamento livre | `Bodyweight Squat` (`bodyweight-squat`) | Exata | Sem carga, movimento geral correspondente. |
| Sentar e levantar da cadeira | — | Sem correspondência segura | Não encontrei um Sit-to-Stand no catálogo; agachamento ou cadeira de yoga não são substitutos visuais. |
| Flexão na parede | `Wall Push Ups` (`wall-push-ups`) | Exata | Nome e apoio correspondem. |
| Flexão com apoio alto | `Incline Push-Up` (`incline-push-ups`) | Exata com ressalva | Mostrar apoio em banco/caixa semelhante; a altura altera a dificuldade, então a legenda deve dizer apoio elevado. |
| Elevação de panturrilha | `Standing Calf Raise` (`standing-calf-raise`) | Exata | A versão publicada é em pé. Apoio numa parede/cadeira deve permanecer no texto da instrução. |
| Ponte de glúteos | `Glute Bridge` (`glute-bridge`) | Exata | Movimento no solo corresponde. |
| Marcha no lugar | — | Sem correspondência segura | Não encontrei uma marcha simples no lugar; elevação de joelhos não deve ser rotulada como marcha. |
| Passos laterais | `Banded Lateral Walk` (`banded-lateral-walk`) | Variação | Usa faixa elástica; o FitLivre prescreve passos sem faixa. Não usar sem mudar prescrição/equipamento. |
| Toque alternado de calcanhar | `Dead Bug` (`dead-bug`) | Sem correspondência | São movimentos diferentes. A animação anterior de dead bug foi removida desta chave. |
| Extensão alternada em quatro apoios | `Bird-Dog` (`bird-dog`) | Exata | Correspondência direta. |
| Remada com elástico ou polia | `Seated Cable Row` (`seated-cable-row`) | Variação | Só corresponde à opção de polia sentada; não representa elástico em pé. A prescrição precisa selecionar a variação conforme equipamento. |
| Dobradiça de quadril | `Bodyweight Good Morning` (`bodyweight-good-morning`) | Variação | É uma dobradiça, mas postura e alavanca não são equivalentes a uma instrução genérica. Revisar demonstração e texto juntos. |
| Desenvolvimento leve | `Dumbbell Shoulder Press` (`dumbbell-shoulder-press`) | Exata com ressalva | Compatível com halteres leves; a prescrição alternativa de garrafas não aparece no desenho. |
| Rosca com halteres | `Seated Dumbbell Curl` (`seated-dumbbell-curl`) | Variação | O app ensina em pé. Usar apenas se mudar o cue/variação para sentado; não localizei uma correspondência exata de rosca em pé na consulta. |
| Mobilidade de ombros | — | Sem correspondência segura | Não confundir círculos de braço com alongamento, rotação externa ou elevação frontal. |
| Gato e camelo suave | `Cat-Cow` (`cat-cow`) | Exata | Nome e padrão de mobilidade correspondem. |
| Mobilidade de tornozelo na parede | — | Sem correspondência segura | Não encontrei o teste/avanço joelho-à-parede; alongamento de panturrilha é diferente. |
| Respiração e volta à calma | — | Sem correspondência segura | Usar um marcador de ritmo de respiração próprio, sem vídeo de exercício que não corresponda. |
| Elevação alternada de joelhos | — | Sem correspondência segura | Elevação suspensa em cadeira romana não corresponde à variação em pé prescrita. |
| Abertura de braços | — | Sem correspondência segura | É ambíguo se o movimento é abertura de peito, elevação lateral ou círculos; definir a técnica antes de escolher mídia. |

## Implementação 3D do FitLivre

**Status da entrega:** as 21 chaves do catálogo estão mapeadas no protótipo 3D e não usam mais imagens/GIFs do ExerciseDB. O personagem e as cenas procedurais são autorais e o pacote inclui Three.js localmente. Nesta atualização o personagem ganhou rosto com olhos, sobrancelhas, nariz e orelhas, cabelo, dedos simplificados, camiseta com mangas e costuras, shorts, pernas e sapatos detalhados, materiais menos plásticos e luz/sombra melhor ajustadas. A prévia em navegador confirmou o renderizador WebGL, o personagem, a troca de exercícios da galeria e controles de rotação/pausa; 81 amostras por exercício foram verificadas para valores de pose finitos. A verificação amostral é teste de integridade numérica, não validação biomecânica.

O app e a galeria `galeria-3d.html` agora montam em tempo real um personagem 3D articulado com geometria própria (tronco, cabeça, braços, antebraços, coxas, pernas e articulações) e animações procedurais separadas para cada uma das 21 chaves do catálogo. A cena inclui, quando pertinente, cadeira, parede, apoio elevado, colchonete ou elástico; o usuário pode pausar/reproduzir e girar a câmera. A biblioteca Three.js r128 (licença MIT, código local em `three.min.js`; termos em `THREE-LICENSE.txt`) é usada como renderizador WebGL, e o código do movimento fica em `motion3d.js`. Não são usados vídeos ou modelos baixados de terceiros para fabricar as animações.

A animação é 3D de verdade, porém estilizada: não é captura de movimento nem modelo anatômico de alta fidelidade. As referências abaixo orientaram os ciclos e cues; as poses do personagem ainda precisam de revisão por profissional qualificado antes de virarem orientação pública.

## Problemas corrigidos no protótipo

- A busca aproximada do ExerciseDB podia aceitar resultados com nome parecido (por exemplo, marcha como elevação de joelho, ou mobilidade de tornozelo como alongamento de panturrilha). A associação aproximada foi desativada e os GIFs OSS também foram removidos do app por sua restrição de uso não comercial; cada exercício agora chama sua animação 3D própria.
- A flexão com apoio alto usava a mesma chave de mídia da flexão na parede. Agora tem chave independente, evitando exibir a demonstração da parede para a bancada.
- O movimento “toque alternado de calcanhar” não usa mais a imagem de dead bug.
- Sem mídia validada, a demonstração agora pede uma busca de vídeo pelo nome exato do exercício, em vez de fingir que uma animação de outro exercício é equivalente.

## Licença e recomendação

1. **Para protótipo sem monetização:** RepDB Community permite as imagens planas estáticas dentro do app, com crédito visível “Exercise data by RepDB (repdb.co)”. Isso ainda não oferece o movimento contínuo que o usuário quer.
2. **Para app comercial com personagens/animações coerentes:** RepDB Standard anuncia licença comercial de uso sob a marca FitLivre por US$499, pagamento único. Antes da compra, validar com o fornecedor os nove movimentos sem correspondência e os três casos que exigem variação. A página de preço informa 695 movimentos e a prévia informa contagens diferentes de animações, então confirme a cobertura/entrega em contrato ou por escrito.
3. **Para movimentos sem cobertura:** gravar com profissional de educação física/fisioterapeuta ou contratar criação/licença explícita para cada demonstração. O material precisa ser aprovado por profissional habilitado; um GIF de catálogo é ilustração de execução, não avaliação individual.
4. **Vídeo sob demanda:** pode-se oferecer busca externa pelo nome exato (já existe no app). Para tocar automaticamente um vídeo dentro da janela, curar um URL específico por exercício após revisar execução, canal, direitos de incorporação e variação mostrada. Não transformar resultados de busca em vídeo “recomendado” sem esse controle.

## Fontes consultadas

- Three.js r128, renderer WebGL e ciclo de animação (biblioteca incluída localmente, MIT): https://threejs.org/docs/pages/WebGLRenderer.html
- NHS, força (sentar-levantar, mini-agachamento, panturrilha, flexão na parede e rosca): https://www.nhs.uk/live-well/exercise/strength-exercises/
- NHS, vídeos educativos de força e flexibilidade: https://www.nhs.uk/live-well/exercise/strength-and-flex-exercise-plan-how-to-videos/
- ACE Exercise Library (agachamento, bird-dog, cat-cow e outros padrões): https://www.acefitness.org/resources/everyone/exercise-library/

- RepDB lista oficial de cobertura (nomes e slugs dos 695 exercícios): https://repdb.co/exercise-list.json
- RepDB preços, licença comercial e cobertura publicada: https://repdb.co/pricing/
- RepDB licença da versão gratuita (uso comercial dentro de app com atribuição; sem animações): https://github.com/RepDB/exercise-dataset/blob/main/LICENSE-DATA.md
- RepDB perguntas da prévia: animações pagas fornecidas para avaliação em licença CC BY-NC 4.0, exigem licença paga para produto comercial: https://repdb.co/preview/
- ExerciseDB OSS, termos e limitação de uso não comercial: https://oss.exercisedb.dev/docs
- BetterMe informa que seus vídeos são gravados/revisados por pessoas e descreve dicas e erros comuns nos guias de exercício: https://www.reddit.com/r/bettermeofficial/comments/1sx39zy/are_the_videos_ai/ e https://bettermesupport.zendesk.com/hc/en-us/articles/360019800017-Workouts
- NHS, instruções de exercícios de força incluindo sentar-levantar e flexão na parede: https://www.nhs.uk/live-well/exercise/strength-exercises/
- South Tees Hospitals, orientação de fisioterapia para sentar e levantar: https://www.southtees.nhs.uk/resources/sit-to-stand-from-chair-combined/
- Referência de flexão na parede enviada pelo usuário (@BLFITNESS5): https://www.youtube.com/shorts/8lxxv7JKqpE

> A presença de um exercício numa base não valida a segurança do plano para cada usuário. As instruções do FitLivre devem continuar adaptadas ao perfil e ser revisadas por profissional qualificado antes de lançamento público.


## Clareza para quem está aprendendo

A demonstração agora inicia pausada na posição inicial. A pessoa pode avançar entre três poses guiadas (começo, movimento e volta), ler uma dica associada a cada etapa e iniciar o ciclo completo quando quiser. Esse fluxo evita que a animação passe pela pose inicial antes da leitura. As poses geradas continuam sendo modelos didáticos procedurais e exigem validação profissional antes de uso como prescrição.


## Sequência de imagens

A visualização principal passou a mostrar simultaneamente três quadros estáticos por exercício, com início, pose principal e retorno. As figuras são SVG esquemáticos gerados a partir das poses específicas do modelo de cada exercício; cadeira, parede ou bancada aparecem nos movimentos que usam esses apoios. A animação contínua deixou de ser o modo principal de instrução. Revisar visualmente e validar com profissional cada pose e dica antes de publicar como orientação de treino.

## Ajuste visual após referência do usuário
Reorganizada a sequência como três ilustrações lado a lado (começo, movimento, volta), com personagem vetorial colorido, setas de ordem e uma trajetória curva apontando a articulação com maior deslocamento entre início e meio. Em telas estreitas, os quadros ficam em faixa horizontal deslizável. A indicação automática da articulação é ilustrativa; não equivale a análise biomecânica e requer revisão visual específica por exercício.

## Integração atual das ilustrações licenciadas (27/10/2026)

A visualização principal usa frames SVG originais da biblioteca Workout Guide de Bryl Lim, com arte-base de Everkinetic, servidos pelo pacote público no jsDelivr. A licença indicada pelo projeto para os ativos visuais é CC BY-SA 4.0; créditos e links estão no app e em `LICENCA-ILUSTRACOES.md`. O app não modifica os arquivos de imagem.

Correspondências atualmente mapeadas: agachamento livre/agachamento, flexão na parede, flexão inclinada, ponte de glúteos, toque alternado de calcanhar/dead bug, bird dog, cat-cow, mobilidade de ombros/círculos de braço, remada com elástico e desenvolvimento com halteres. A biblioteca não cobre fielmente todos os movimentos da FitLivre. Para exercícios sem correspondência, a interface declara que não há ilustração e não mostra uma imagem semelhante; preserva cue e busca de vídeo.

As imagens são carregadas externamente e requerem internet; não estão incluídas offline no pacote. O HTML do app segue usando a sequência ilustrada principal, não o modelo procedural anterior. Esta mudança de fonte visual não representa validação clínica das instruções ou da prescrição individual.

Fontes consultadas:
- Repositório e descrição da biblioteca Workout Guide (302 exercícios, três quadros, distribuição dos SVGs e licença dos ativos): https://github.com/bryllim/workout-guide
- Manifesto de exercícios e caminhos dos frames: https://github.com/bryllim/workout-guide/blob/main/packages/workout-guide/manifest.json
- Licença CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/
- Arte-base Everkinetic: https://github.com/everkinetic/data
## Pré-carregamento offline no navegador

Foi adicionado o botão “Baixar imagens para usar sem internet”. Ele baixa os 30 quadros dos 10 movimentos mapeados, tenta duas fontes públicas (jsDelivr e GitHub Raw), valida que cada resposta é SVG e guarda o conteúdo no armazenamento local do navegador. Os quadros já guardados são renderizados como `data:` URL sem conexão. O armazenamento é específico do navegador e dispositivo; não transfere as imagens para uma cópia do ZIP. O download inicial exige conexão e os servidores públicos precisam permitir CORS. O botão comunica a quantidade realmente armazenada e mantém o erro visível caso as origens estejam indisponíveis.
## Correção da imagem vazia e cadeira (27/10/2026)

As capturas do usuário mostram que a versão anterior classificava como SVG qualquer resposta que apenas contivesse `<svg`; uma página HTML de erro do CDN também pode conter ícones SVG e acabava salva como se fosse a ilustração. O cache foi versionado e agora valida a raiz XML como `<svg>` antes de salvar ou exibir o quadro. Respostas inválidas não contam como baixadas. O total correto do pré-carregamento é 30 quadros SVG e um PNG do exercício de cadeira.

Para “Sentar e levantar da cadeira”, foi encontrada a ilustração de BruceBlaus no Wikimedia Commons, identificada como exercício de agachamento com cadeira e licenciada CC BY-SA 4.0. Ela aparece em um quadro único grande porque o próprio PNG mostra as posições do exercício; não é duplicada ou apresentada como três poses distintas.

Fontes: https://commons.wikimedia.org/wiki/File:Exercise_Chair_Squat.png · https://creativecommons.org/licenses/by-sa/4.0/
## Substituição do exercício da cadeira (27/10/2026)

A pedido do usuário, o exercício “Sentar e levantar da cadeira” foi retirado do catálogo e das rotinas. As ocorrências foram substituídas por “Agachamento livre”, usando os quadros licenciados da biblioteca Workout Guide. O PNG de cadeira do Wikimedia Commons deixou de ser carregado ou distribuído pelo app. A versão anterior desta auditoria registrava a inclusão temporária desse PNG; esse registro foi supersedido por esta alteração.
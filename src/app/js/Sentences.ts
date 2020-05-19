import { OO_DISCOO, OO_INFOO, OO_CINOOCHE, OO_YOOGA, OO_VEGETOO, OO_COOMIQUE, OO_WHOOW } from './Oo';
import { Interaction, Sentence } from './Scenario';

interface IScenario {
  oos: string[];
  sentences: Sentence[];
}

interface IScenarios {
  scenarios: IScenario[];
}

export const Sentences: IScenarios = {
  scenarios: [
    {
      oos: [OO_DISCOO.name, OO_INFOO.name, OO_CINOOCHE.name],
      sentences: [
        {
          id: 1,
          oo: OO_DISCOO.name,
          text: 'Hello Duke',
          nextSentence: 2,
        },
        {
          id: 2,
          oo: OO_INFOO.name,
          text: 'Coucou Disc’Oo. Ça vous dit de commencer par une petite anecdote marrante ?',
          interaction: Interaction.LIKE,
          nextSentence: 3,
        },
        {
          id: 3,
          oo: OO_INFOO.name,
          text: 'Est ce que vous saviez que pour se saluer, certains moines tibétains se tirent la langue ? C’est rigolo, on devrait essayer aussi.',
          nextSentence: 4,
        },
        {
          id: 4,
          oo: OO_DISCOO.name,
          text: 'Ce serait plus pratique si on avait une langue Inf’Oo ...',
          nextSentence: 5,
        },
        {
          id: 5,
          oo: OO_CINOOCHE.name,
          text: "C'est pas faux.",
          nextSentence: 6,
        },
        {
          id: 6,
          oo: OO_DISCOO.name,
          text: 'Par contre, on peut s’inspirer des moines tibétains pour leur musique. Ils la composent en frappant sur des bols.',
          nextSentence: 7,
        },
        {
          id: 7,
          oo: OO_INFOO.name,
          text: 'Oui, d’ailleurs ces bols sont composés de 7 métaux différents, représentant les planètes du système solaire.',
          nextSentence: 8,
        },
        {
          id: 8,
          oo: OO_DISCOO.name,
          text: 'Ah ouais je le savais pas tiens ! On s’en écoute un morceau, voir ce que ça donne ?',
          interaction: Interaction.DISLIKE,
          nextSentence: 9,
        },
        {
          id: 9,
          oo: OO_DISCOO.name,
          text: 'Ok, une autre fois peut-être !',
          nextSentence: 10,
        },
        {
          id: 10,
          oo: OO_CINOOCHE.name,
          text: 'Dites, vous saviez que Georges Clooney avait aussi des troubles du sommeil ?',
          nextSentence: 11,
        },
        {
          id: 11,
          oo: OO_INFOO.name,
          text:
            'Oui, j’en ai entendu parlé, il parait qu’il se réveille beaucoup la nuit, et qu’il en profite pour écrire. Ca t’es déjà arrivé d’écrire pendant une nuit Duke ?',
          interaction: Interaction.LIKE,
          nextSentence: 12,
        },
        {
          id: 12,
          oo: OO_CINOOCHE.name,
          text: 'Chouette, j’espère que tu nous liras ça un jour.',
          interaction: Interaction.OFF,
          nextSentence: 13,
        },
        {
          id: 13,
          oo: OO_CINOOCHE.name,
          text: 'Oh ! Bonne nuit Duke, à la prochaine !',
          nextSentence: 14,
        },
        {
          id: 14,
          oo: OO_INFOO.name,
          text: 'Salut Duke, trop chouette ce moment !',
        },
      ],
    },
    {
      oos: [OO_DISCOO.name, OO_CINOOCHE.name, OO_INFOO.name, OO_YOOGA.name, OO_VEGETOO.name],
      sentences: [
        {
          id: 1,
          oo: OO_DISCOO.name,
          text: 'Hello Duke !',
          nextSentence: 2,
        },
        {
          id: 2,
          oo: OO_VEGETOO.name,
          text: 'Bonsoir Duke ! Bonsoir la tribu !',
          nextSentence: 3,
        },
        {
          id: 3,
          oo: OO_INFOO.name,
          text: 'Coucou Végét’Oo. Ça vous dit de commencer par une petite anecdote marrante ?',
          interaction: Interaction.LIKE,
          nextSentence: 4,
        },
        {
          id: 4,
          oo: OO_INFOO.name,
          text: 'Est ce que vous saviez que pour se saluer, certains moines tibétains se tirent la langue ? C’est rigolo, on devrait essayer aussi.',
          nextSentence: 5,
        },
        {
          id: 5,
          oo: OO_YOOGA.name,
          text: 'Ce serait plus pratique si on avait une langue Inf’Oo ...',
          nextSentence: 6,
        },
        {
          id: 6,
          oo: OO_CINOOCHE.name,
          text: 'C’est pas faux.',
          nextSentence: 7,
        },
        {
          id: 7,
          oo: OO_DISCOO.name,
          text: 'Par contre, on peut s’inspirer des moines tibétains pour leur musique. Ils la composent en frappant sur des bols.',
          nextSentence: 8,
        },
        {
          id: 8,
          oo: OO_YOOGA.name,
          text: 'Oui, il se servent de ces sons pour méditer, c’est plutot reposant.',
          nextSentence: 9,
        },
        {
          id: 9,
          oo: OO_INFOO.name,
          text: 'D’ailleurs ces bols sont composés de 7 métaux différents, représentant les planètes du système solaire.',
          nextSentence: 10,
        },
        {
          id: 10,
          oo: OO_DISCOO.name,
          text: 'Ah ouais je le savais pas tiens ! On s’en écoute un morceau, voir ce que ça donne ?',
          interaction: Interaction.DISLIKE,
          nextSentence: 11,
        },
        {
          id: 11,
          oo: OO_DISCOO.name,
          text: 'Ok, une autre fois peut-être !',
          nextSentence: 12,
        },
        {
          id: 12,
          oo: OO_VEGETOO.name,
          text: 'Je commence à avoir soif, je me servirais bien une tisane. Ça te dirait Duke ?',
          interaction: Interaction.LIKE,
          nextSentence: 13,
        },
        {
          id: 13,
          oo: OO_VEGETOO.name,
          text: 'Super ! Peut être une petite verveine ou une camomille, je te laisse choisir. Est-ce que tu as déjà bu une tisane d’ortie ?',
          interaction: Interaction.DISLIKE,
          nextSentence: 14,
        },
        {
          id: 14,
          oo: OO_YOOGA.name,
          text: 'Moi j’en ai bu une fois, je m’attendais à ce que ça pique, mais en faite pas du tout, c’est tout doux.',
          nextSentence: 15,
        },
        {
          id: 15,
          oo: OO_INFOO.name,
          text: 'Il parait que c’est très bon pour le corps, notamment la peau et les reins.',
          nextSentence: 16,
        },
        {
          id: 16,
          oo: OO_VEGETOO.name,
          text: 'Oui c’est aussi riche en calcium. C’est drôle que cette plante urticante soit aussi cool pour nous une fois cuisinée.',
          nextSentence: 17,
        },
        {
          id: 17,
          oo: OO_CINOOCHE.name,
          text:
            'Oh il y a un documentaire que tu devrais regarder Y’Oo’ga, sur la pratique du yoga moderne, ça s’appelle Le souffle des Dieux. Je ne l’ai pas encore vu mais c’est sans doute interessant.',
          nextSentence: 18,
        },
        {
          id: 18,
          oo: OO_YOOGA.name,
          text: 'J’espère qu’il parle de la posture de la sauterelle dedans, c’est une de mes préférées.',
          interaction: Interaction.OFF,
          nextSentence: 19,
        },
        {
          id: 19,
          oo: OO_CINOOCHE.name,
          text: 'Oh ! Bonne nuit Duke, à la prochaine !',
          nextSentence: 20,
        },
        {
          id: 20,
          oo: OO_YOOGA.name,
          text: 'Dors bien !',
          nextSentence: 21,
        },
        {
          id: 21,
          oo: OO_INFOO.name,
          text: 'Salut Duke, trop chouette ce moment !',
        },
      ],
    },
    {
      oos: [OO_DISCOO.name, OO_CINOOCHE.name, OO_INFOO.name, OO_YOOGA.name, OO_COOMIQUE.name],
      sentences: [
        {
          id: 1,
          oo: OO_DISCOO.name,
          text: 'Hello Duke !',
          nextSentence: 2,
        },
        {
          id: 2,
          oo: OO_COOMIQUE.name,
          text: 'Salut la tribu !',
          nextSentence: 3,
        },
        {
          id: 3,
          oo: OO_INFOO.name,
          text: 'Coucou Végét’Oo. Ça vous dit de commencer par une petite anecdote marrante ?',
          interaction: Interaction.LIKE,
          nextSentence: 4,
        },
        {
          id: 4,
          oo: OO_INFOO.name,
          text: 'Est ce que vous saviez que pour se saluer, certains moines tibétains se tirent la langue ? C’est rigolo, on devrait essayer aussi.',
          nextSentence: 5,
        },
        {
          id: 5,
          oo: OO_YOOGA.name,
          text: 'Ce serait plus pratique si on avait une langue Inf’Oo ...',
          nextSentence: 6,
        },
        {
          id: 6,
          oo: OO_CINOOCHE.name,
          text: 'C’est pas faux.',
          nextSentence: 7,
        },
        {
          id: 7,
          oo: OO_DISCOO.name,
          text: 'Par contre, on peut s’inspirer des moines tibétains pour leur musique. Ils la composent en frappant sur des bols.',
          nextSentence: 8,
        },
        {
          id: 8,
          oo: OO_YOOGA.name,
          text: 'Oui, il se servent de ces sons pour méditer, c’est plutot reposant.',
          nextSentence: 9,
        },
        {
          id: 9,
          oo: OO_INFOO.name,
          text: 'D’ailleurs ces bols sont composés de 7 métaux différents, représentant les planètes du système solaire.',
          nextSentence: 10,
        },
        {
          id: 10,
          oo: OO_DISCOO.name,
          text: 'Ah ouais je le savais pas tiens ! On s’en écoute un morceau, voir ce que ça donne ?',
          interaction: Interaction.DISLIKE,
          nextSentence: 11,
        },
        {
          id: 11,
          oo: OO_DISCOO.name,
          text: 'Ok, une autre fois peut-être !',
          nextSentence: 12,
        },
        {
          id: 12,
          oo: OO_COOMIQUE.name,
          text: 'C’est vraiment pas de bol !',
          nextSentence: 13,
        },
        {
          id: 13,
          oo: OO_CINOOCHE.name,
          text: 'Hihi !',
          nextSentence: 14,
        },
        {
          id: 14,
          oo: OO_YOOGA.name,
          text:
            'Peut être qu’on peut faire un peu de méditation, même si on a pas la musique. Tu en dis quoi Duke, on prend 5 minutes de silence pour respirer un coup ?',
          interaction: Interaction.LIKE,
          nextSentence: 15,
        },
        {
          id: 15,
          oo: OO_YOOGA.name,
          text: 'Super, installe toi confortablement ! À dans 5 minutes !',
          nextSentence: 16,
        },
        {
          id: 16,
          oo: OO_DISCOO.name,
          text: 'Ouah, c’était sympa ce petit moment de pause.',
          nextSentence: 17,
        },
        {
          id: 17,
          oo: OO_YOOGA.name,
          text: 'Ça t’a plu Duke ?',
          interaction: Interaction.LIKE,
          nextSentence: 18,
        },
        {
          id: 18,
          oo: OO_YOOGA.name,
          text: 'Chouette, on en refera de temps en temps alors.',
          interaction: Interaction.OFF,
          nextSentence: 19,
        },
        {
          id: 19,
          oo: OO_CINOOCHE.name,
          text: 'Oh ! Bonne nuit Duke, à la prochaine !',
          nextSentence: 20,
        },
        {
          id: 20,
          oo: OO_YOOGA.name,
          text: 'Dors bien !',
          nextSentence: 21,
        },
        {
          id: 21,
          oo: OO_INFOO.name,
          text: 'Salut Duke, trop chouette ce moment !',
        },
      ],
    },
    {
      oos: [OO_DISCOO.name, OO_CINOOCHE.name, OO_INFOO.name, OO_WHOOW.name, OO_VEGETOO.name],
      sentences: [
        {
          id: 1,
          oo: OO_DISCOO.name,
          text: 'Hello Duke !',
          nextSentence: 2,
        },
        {
          id: 2,
          oo: OO_VEGETOO.name,
          text: 'Bonsoir Duke ! Bonsoir la tribu !',
          nextSentence: 3,
        },
        {
          id: 3,
          oo: OO_INFOO.name,
          text: 'Coucou Végét’Oo. Ça vous dit de commencer par une petite anecdote marrante ?',
          interaction: Interaction.LIKE,
          nextSentence: 4,
        },
        {
          id: 4,
          oo: OO_INFOO.name,
          text: 'Est ce que vous saviez que pour se saluer, certains moines tibétains se tirent la langue ? C’est rigolo, on devrait essayer aussi.',
          nextSentence: 5,
        },
        {
          id: 5,
          oo: OO_WHOOW.name,
          text: 'Ce serait plus pratique si on avait une langue Inf’Oo ...',
          nextSentence: 6,
        },
        {
          id: 6,
          oo: OO_CINOOCHE.name,
          text: 'C’est pas faux.',
          nextSentence: 7,
        },
        {
          id: 7,
          oo: OO_DISCOO.name,
          text: 'Par contre, on peut s’inspirer des moines tibétains pour leur musique. Ils la composent en frappant sur des bols.',
          nextSentence: 8,
        },
        {
          id: 8,
          oo: OO_DISCOO.name,
          text: '',
          nextSentence: 9,
        },
        {
          id: 9,
          oo: OO_INFOO.name,
          text: 'D’ailleurs ces bols sont composés de 7 métaux différents, représentant les planètes du système solaire.',
          nextSentence: 10,
        },
        {
          id: 10,
          oo: OO_DISCOO.name,
          text: 'Ah ouais je le savais pas tiens ! On s’en écoute un morceau, voir ce que ça donne ?',
          nextSentence: 11,
        },
        {
          id: 11,
          oo: OO_WHOOW.name,
          text: 'Oh oui, et on choisi un titre ou un groupe qui contient un mot au hasard ?',
          nextSentence: 12,
        },
        {
          id: 12,
          oo: OO_DISCOO.name,
          text: 'Ca te dit Duke ?',
          interaction: Interaction.DISLIKE,
          nextSentence: 13,
        },
        {
          id: 13,
          oo: OO_DISCOO.name,
          text: 'Ok, une autre fois peut-être !',
          nextSentence: 14,
        },
        {
          id: 14,
          oo: OO_VEGETOO.name,
          text: 'Je commence à avoir soif, je me servirais bien une tisane. Ça te dirait Duke ?',
          interaction: Interaction.LIKE,
          nextSentence: 15,
        },
        {
          id: 15,
          oo: OO_VEGETOO.name,
          text: 'Super ! Peut être une petite verveine ou une camomille, je te laisse choisir.',
          nextSentence: 16,
        },
        {
          id: 16,
          oo: OO_WHOOW.name,
          text: 'Est-ce qu’on tire à pile ou face ?',
          interaction: Interaction.LIKE,
          nextSentence: 17,
        },
        {
          id: 17,
          oo: OO_WHOOW.name,
          text: 'Cool ! Je te laisse choisir à quoi correspond pile et à quoi correspond face Duke. C’est partiiiiii ! Pile !',
          nextSentence: 18,
        },
        {
          id: 18,
          oo: OO_VEGETOO.name,
          text: 'C’est vrai qu’il n’y a pas que Verveine ou camomille. Est-ce que tu as déjà bu une tisane d’ortie Duke ?',
          interaction: Interaction.DISLIKE,
          nextSentence: 19,
        },
        {
          id: 19,
          oo: OO_INFOO.name,
          text: 'Il parait que c’est très bon pour le corps, notamment la peau et les reins.',
          nextSentence: 20,
        },
        {
          id: 20,
          oo: OO_VEGETOO.name,
          text: 'Oui c’est aussi riche en calcium. C’est drôle que cette plante urticante soit aussi cool pour nous une fois cuisinée.',
          interaction: Interaction.OFF,
          nextSentence: 21,
        },
        {
          id: 21,
          oo: OO_CINOOCHE.name,
          text: 'Oh ! Bonne nuit Duke, à la prochaine !',
          nextSentence: 22,
        },
        {
          id: 22,
          oo: OO_WHOOW.name,
          text: 'Dors bien !',
          nextSentence: 23,
        },
        {
          id: 23,
          oo: OO_INFOO.name,
          text: 'Salut Duke, trop chouette ce moment !',
        },
      ],
    },
    {
      oos: [OO_DISCOO.name, OO_CINOOCHE.name, OO_INFOO.name, OO_WHOOW.name, OO_COOMIQUE.name],
      sentences: [
        {
          id: 1,
          oo: OO_DISCOO.name,
          text: 'Hello Duke !',
          nextSentence: 2,
        },
        {
          id: 2,
          oo: OO_COOMIQUE.name,
          text: 'Salut la tribu !',
          nextSentence: 3,
        },
        {
          id: 3,
          oo: OO_INFOO.name,
          text: 'Coucou C’Oo’mique. Ça vous dit de commencer par une petite anecdote marrante ?',
          interaction: Interaction.LIKE,
          nextSentence: 4,
        },
        {
          id: 4,
          oo: OO_INFOO.name,
          text: 'Est ce que vous saviez que pour se saluer, certains moines tibétains se tirent la langue ? C’est rigolo, on devrait essayer aussi.',
          nextSentence: 5,
        },
        {
          id: 5,
          oo: OO_WHOOW.name,
          text: 'Ce serait plus pratique si on avait une langue Inf’Oo ...',
          nextSentence: 6,
        },
        {
          id: 6,
          oo: OO_CINOOCHE.name,
          text: 'C’est pas faux.',
          nextSentence: 7,
        },
        {
          id: 7,
          oo: OO_DISCOO.name,
          text: 'Par contre, on peut s’inspirer des moines tibétains pour leur musique. Ils la composent en frappant sur des bols.',
          nextSentence: 8,
        },
        {
          id: 8,
          oo: OO_DISCOO.name,
          text: '',
          nextSentence: 9,
        },
        {
          id: 9,
          oo: OO_INFOO.name,
          text: 'D’ailleurs ces bols sont composés de 7 métaux différents, représentant les planètes du système solaire.',
          nextSentence: 10,
        },
        {
          id: 10,
          oo: OO_DISCOO.name,
          text: 'Ah ouais je le savais pas tiens ! On s’en écoute un morceau, voir ce que ça donne ?',
          interaction: Interaction.DISLIKE,
          nextSentence: 11,
        },
        {
          id: 11,
          oo: OO_WHOOW.name,
          text: 'Oh oui, et on choisi un titre ou un groupe qui contient un mot au hasard ?',
          nextSentence: 12,
        },
        {
          id: 12,
          oo: OO_DISCOO.name,
          text: 'Ca te dit Duke ?',
          interaction: Interaction.DISLIKE,
          nextSentence: 13,
        },
        {
          id: 13,
          oo: OO_DISCOO.name,
          text: 'Ok, une autre fois peut-être !',
          nextSentence: 14,
        },
        {
          id: 14,
          oo: OO_COOMIQUE.name,
          text: 'C’est vraiment pas de bol !',
          nextSentence: 15,
        },
        {
          id: 15,
          oo: OO_CINOOCHE.name,
          text: 'Hihi !',
          nextSentence: 16,
        },
        {
          id: 16,
          oo: OO_WHOOW.name,
          text: 'Oula, elle était pas très bonne cette blague...',
          nextSentence: 17,
        },
        {
          id: 17,
          oo: OO_COOMIQUE.name,
          text: 'Moi je la trouve pas mauvaise !',
          nextSentence: 18,
        },
        {
          id: 18,
          oo: OO_CINOOCHE.name,
          text: "Vous savez, moi je ne crois pas qu'il y ait de bonne ou de mauvaise situation.",
          nextSentence: 19,
        },
        {
          id: 19,
          oo: OO_INFOO.name,
          text:
            'Dis Cin’Oo’che, tu savais que ce monologue de Otis dans Asterix Mission Cléopatre avait été improvisé par l’acteur Edouard Bear ? En plus, ils l’ont raccourcis pour le film final, à l’origine, il était beaucoup plus long.',
          nextSentence: 20,
        },
        {
          id: 20,
          oo: OO_CINOOCHE.name,
          text: 'Ouah trop cool !',
          interaction: Interaction.OFF,
          nextSentence: 21,
        },
        {
          id: 21,
          oo: OO_CINOOCHE.name,
          text: 'Oh ! Bonne nuit Duke, à la prochaine !',
          nextSentence: 22,
        },
        {
          id: 22,
          oo: OO_WHOOW.name,
          text: 'Dors bien !',
          nextSentence: 23,
        },
        {
          id: 23,
          oo: OO_INFOO.name,
          text: 'Salut Duke, trop chouette ce moment !',
        },
      ],
    },
    {
      oos: [OO_DISCOO.name, OO_CINOOCHE.name, OO_INFOO.name, OO_WHOOW.name, OO_YOOGA.name],
      sentences: [
        {
          id: 1,
          oo: OO_DISCOO.name,
          text: 'Hello Duke !',
          nextSentence: 2,
        },
        {
          id: 2,
          oo: OO_INFOO.name,
          text: 'Coucou Disc’Oo. Ça vous dit de commencer par une petite anecdote marrante ?',
          interaction: Interaction.LIKE,
          nextSentence: 3,
        },
        {
          id: 3,
          oo: OO_INFOO.name,
          text: 'Est ce que vous saviez que pour se saluer, certains moines tibétains se tirent la langue ? C’est rigolo, on devrait essayer aussi.',
          nextSentence: 4,
        },
        {
          id: 4,
          oo: OO_WHOOW.name,
          text: 'Ce serait plus pratique si on avait une langue Inf’Oo ...',
          nextSentence: 5,
        },
        {
          id: 5,
          oo: OO_CINOOCHE.name,
          text: 'C’est pas faux.',
          nextSentence: 6,
        },
        {
          id: 6,
          oo: OO_DISCOO.name,
          text: 'Par contre, on peut s’inspirer des moines tibétains pour leur musique. Ils la composent en frappant sur des bols.',
          nextSentence: 7,
        },
        {
          id: 7,
          oo: OO_YOOGA.name,
          text: 'Oui, il se servent de ces sons pour méditer, c’est plutot reposant.',
          nextSentence: 8,
        },
        {
          id: 8,
          oo: OO_INFOO.name,
          text: 'D’ailleurs ces bols sont composés de 7 métaux différents, représentant les planètes du système solaire.',
          nextSentence: 9,
        },
        {
          id: 9,
          oo: OO_DISCOO.name,
          text: 'Ah ouais je le savais pas tiens ! On s’en écoute un morceau, voir ce que ça donne ?',
          nextSentence: 10,
        },
        {
          id: 10,
          oo: OO_WHOOW.name,
          text: 'Oh oui, et on choisi un titre ou un groupe qui contient un mot au hasard ?',
          nextSentence: 11,
        },
        {
          id: 11,
          oo: OO_DISCOO.name,
          text: 'Ca te dit Duke ?',
          interaction: Interaction.DISLIKE,
          nextSentence: 12,
        },
        {
          id: 12,
          oo: OO_DISCOO.name,
          text: 'Ok, une autre fois peut-être !',
          nextSentence: 13,
        },
        {
          id: 13,
          oo: OO_YOOGA.name,
          text:
            'Peut être qu’on peut faire un peu de méditation, même si on a pas la musique. Tu en dis quoi Duke, on prend 5 minutes de silence pour respirer un coup ?',
          interaction: Interaction.LIKE,
          nextSentence: 14,
        },
        {
          id: 14,
          oo: OO_YOOGA.name,
          text: 'Super, installe toi confortablement ! À dans 5 minutes !',
          nextSentence: 15,
        },
        {
          id: 15,
          oo: OO_DISCOO.name,
          text: 'Ouah, c’était sympa ce petit moment de pause.',
          nextSentence: 16,
        },
        {
          id: 16,
          oo: OO_YOOGA.name,
          text: 'Ça t’a plu Duke ?',
          interaction: Interaction.LIKE,
          nextSentence: 17,
        },
        {
          id: 17,
          oo: OO_YOOGA.name,
          text: 'Chouette, on en refera de temps en temps alors.',
          interaction: Interaction.OFF,
          nextSentence: 18,
        },
        {
          id: 18,
          oo: OO_CINOOCHE.name,
          text: 'Oh ! Bonne nuit Duke, à la prochaine !',
          nextSentence: 19,
        },
        {
          id: 19,
          oo: OO_WHOOW.name,
          text: 'Dors bien !',
          nextSentence: 20,
        },
        {
          id: 20,
          oo: OO_INFOO.name,
          text: 'Salut Duke, trop chouette ce moment !',
        },
      ],
    },
    {
      oos: [OO_DISCOO.name, OO_CINOOCHE.name, OO_INFOO.name, OO_COOMIQUE.name, OO_VEGETOO.name],
      sentences: [
        {
          id: 1,
          oo: OO_DISCOO.name,
          text: 'Hello Duke !',
          nextSentence: 2,
        },
        {
          id: 2,
          oo: OO_VEGETOO.name,
          text: 'Bonsoir Duke ! Bonsoir la tribu !',
          nextSentence: 3,
        },
        {
          id: 3,
          oo: OO_INFOO.name,
          text: 'Coucou Végét’Oo. Ça vous dit de commencer par une petite anecdote marrante ?',
          interaction: Interaction.LIKE,
          nextSentence: 4,
        },
        {
          id: 4,
          oo: OO_INFOO.name,
          text: 'Est ce que vous saviez que pour se saluer, certains moines tibétains se tirent la langue ? C’est rigolo, on devrait essayer aussi.',
          nextSentence: 5,
        },
        {
          id: 5,
          oo: OO_DISCOO.name,
          text: 'Ce serait plus pratique si on avait une langue Inf’Oo ...',
          nextSentence: 6,
        },
        {
          id: 6,
          oo: OO_CINOOCHE.name,
          text: 'C’est pas faux.',
          nextSentence: 7,
        },
        {
          id: 7,
          oo: OO_DISCOO.name,
          text: 'Par contre, on peut s’inspirer des moines tibétains pour leur musique. Ils la composent en frappant sur des bols.',
          nextSentence: 8,
        },
        {
          id: 8,
          oo: OO_DISCOO.name,
          text: '',
          nextSentence: 9,
        },
        {
          id: 9,
          oo: OO_INFOO.name,
          text: 'D’ailleurs ces bols sont composés de 7 métaux différents, représentant les planètes du système solaire.',
          nextSentence: 10,
        },
        {
          id: 10,
          oo: OO_DISCOO.name,
          text: 'Ah ouais je le savais pas tiens ! On s’en écoute un morceau, voir ce que ça donne ?',
          interaction: Interaction.DISLIKE,
          nextSentence: 11,
        },
        {
          id: 11,
          oo: OO_DISCOO.name,
          text: 'Ok, une autre fois peut-être !',
          nextSentence: 12,
        },
        {
          id: 12,
          oo: OO_COOMIQUE.name,
          text: 'C’est vraiment pas de bol !',
          nextSentence: 13,
        },
        {
          id: 13,
          oo: OO_CINOOCHE.name,
          text: 'Hihi !',
          nextSentence: 14,
        },
        {
          id: 14,
          oo: OO_VEGETOO.name,
          text: 'Pfff t’en as des meilleures C’Oo’mique ...',
          nextSentence: 15,
        },
        {
          id: 15,
          oo: OO_COOMIQUE.name,
          text: 'Moi je la trouve pas mauvaise !',
          nextSentence: 16,
        },
        {
          id: 16,
          oo: OO_CINOOCHE.name,
          text: "Vous savez, moi je ne crois pas qu'il y ait de bonne ou de mauvaise situation.",
          nextSentence: 17,
        },
        {
          id: 17,
          oo: OO_INFOO.name,
          text:
            'Dis Cin’Oo’che, tu savais que ce monologue de Otis dans Asterix Mission Cléopatre avait été improvisé par l’acteur Edouard Bear ? En plus, ils l’ont raccourcis pour le film final, à l’origine, il était beaucoup plus long.',
          nextSentence: 18,
        },
        {
          id: 18,
          oo: OO_CINOOCHE.name,
          text: 'Ouah trop cool !',
          nextSentence: 19,
        },
        {
          id: 19,
          oo: OO_VEGETOO.name,
          text: 'Je commence à avoir soif, je me servirais bien une tisane. Ça te dirait Duke ?',
          interaction: Interaction.LIKE,
          nextSentence: 20,
        },
        {
          id: 20,
          oo: OO_VEGETOO.name,
          text: 'Super ! Peut être une petite verveine ou une camomille, je te laisse choisir. Est-ce que tu as déjà bu une tisane d’ortie ?',
          interaction: Interaction.DISLIKE,
          nextSentence: 21,
        },
        {
          id: 21,
          oo: OO_INFOO.name,
          text: 'Il parait que c’est très bon pour le corps, notamment la peau et les reins.',
          nextSentence: 22,
        },
        {
          id: 22,
          oo: OO_VEGETOO.name,
          text: 'Oui c’est aussi riche en calcium. C’est drôle que cette plante urticante soit aussi cool pour nous une fois cuisinée.',
          interaction: Interaction.OFF,
          nextSentence: 23,
        },
        {
          id: 23,
          oo: OO_CINOOCHE.name,
          text: 'Oh ! Bonne nuit Duke, à la prochaine !',
          nextSentence: 24,
        },
        {
          id: 24,
          oo: OO_COOMIQUE.name,
          text: 'Dors bien !',
          nextSentence: 25,
        },
        {
          id: 25,
          oo: OO_INFOO.name,
          text: 'Salut Duke, trop chouette ce moment !',
        },
      ],
    },
  ],
};

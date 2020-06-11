enum Interaction {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  OFF = 'OFF',
  ON = 'ON',
}

interface myOo {
  uuid: string;
  color: string;
  createdAt: string;
  description: string;
  name: string;
  objectName: string;
  toreObjectName: string;
}

interface Audio {
  uuid: string;
  name: string;
  url: string;
  type?: string | null;
  oo: myOo;
  encodedData?: string | null;
  interaction: boolean;
  order?: number | null;
  dislikes: Audio[];
}

interface IScenario {
  uuid: string;
  name: string;
  negative_entries: Audio[];
  neutral_entries: Audio[];
  positive_entries: Audio[];
  exits: Audio[];
  sentences: Audio[];
  oos: myOo[];
}

export { Interaction, IScenario, Audio };

export default class Scenario {
  private iscenario: IScenario;
  private previousEnd: string;

  constructor(iscenario: IScenario, previousEnd: string) {
    this.iscenario = iscenario;
    this.previousEnd = previousEnd;
  }

  getScenarioDetails() {
    return this.iscenario;
  }

  getPreviousEndType() {
    return this.previousEnd;
  }
}

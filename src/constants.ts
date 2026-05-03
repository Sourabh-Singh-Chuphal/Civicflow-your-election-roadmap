export interface ElectionStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'completed' | 'current' | 'upcoming';
}

export const ELECTION_STEPS: ElectionStep[] = [
  {
    id: '1',
    title: 'Voter Registration',
    description: 'The first step is ensuring you are registered to vote in your designated jurisdiction.',
    icon: 'user-plus',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Candidate Nomination',
    description: 'Individuals file their papers to run for specific offices and represent their parties or interests.',
    icon: 'file-text',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Campaigning Phase',
    description: 'Candidates present their platforms, engage with voters, and participate in debates.',
    icon: 'megaphone',
    status: 'current',
  },
  {
    id: '4',
    title: 'Election Day',
    description: 'Citizens cast their ballots at polling stations or via mail-in systems.',
    icon: 'vote',
    status: 'upcoming',
  },
  {
    id: '5',
    title: 'Vote Counting',
    description: 'Official tallies are made, and results are audited for accuracy and transparency.',
    icon: 'bar-chart',
    status: 'upcoming',
  },
  {
    id: '6',
    title: 'Certification',
    description: 'Election results are officially certified, and winners are declared.',
    icon: 'check-circle',
    status: 'upcoming',
  },
];

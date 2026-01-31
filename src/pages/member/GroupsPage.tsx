import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import { Group } from '../../types';
export function GroupsPage() {
  // Mock Data
  const myGroups: Group[] = [
  {
    id: '1',
    name: 'Product Designers',
    description:
    'A space for product designers to share resources, ask for feedback, and discuss trends.',
    memberCount: 142,
    isPrivate: false,
    imageUrl:
    'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'San Francisco Chapter',
    description: 'Local community members based in the SF Bay Area.',
    memberCount: 85,
    isPrivate: true,
    imageUrl:
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }];

  const suggestedGroups: Group[] = [
  {
    id: '3',
    name: 'Sustainability Advocates',
    description:
    'Discussing ways to make our work and lives more sustainable.',
    memberCount: 210,
    isPrivate: false,
    imageUrl:
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    name: 'Book Club',
    description:
    'Monthly book discussions on professional development and leadership.',
    memberCount: 45,
    isPrivate: false,
    imageUrl:
    'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }];

  const GroupCard = ({
    group,
    isMember



  }: {group: Group;isMember: boolean;}) =>
  <Link to={`/dashboard/groups/${group.id}`} className="block h-full">
      <Card hoverable className="h-full flex flex-col">
        <div className="h-32 bg-gray-100 relative">
          {group.imageUrl ?
        <img
          src={group.imageUrl}
          alt={group.name}
          className="w-full h-full object-cover" /> :


        <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Users className="w-10 h-10" />
            </div>
        }
          {group.isPrivate &&
        <Badge variant="warning" className="absolute top-2 right-2">
              Private
            </Badge>
        }
        </div>
        <CardContent className="flex-1 flex flex-col p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2">{group.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {group.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
            <span className="text-xs text-gray-500 flex items-center">
              <Users className="w-3 h-3 mr-1" /> {group.memberCount} members
            </span>
            {isMember ?
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Member
              </span> :

          <span className="text-xs font-medium text-[var(--color-primary)] flex items-center group-hover:underline">
                View Group <ArrowRight className="w-3 h-3 ml-1" />
              </span>
          }
          </div>
        </CardContent>
      </Card>
    </Link>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-500">
            Connect with members who share your interests.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>Create Group</Button>
      </div>

      {/* My Groups */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">My Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGroups.map((group) =>
          <GroupCard key={group.id} group={group} isMember={true} />
          )}
        </div>
      </section>

      {/* Suggested Groups */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Suggested for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedGroups.map((group) =>
          <GroupCard key={group.id} group={group} isMember={false} />
          )}
        </div>
      </section>
    </div>);

}
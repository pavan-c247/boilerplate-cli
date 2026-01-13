import React from "react";
import { Placeholder } from "react-bootstrap";

import Card from "@/components/pure-components/Card/Card";

const CommonCardSkeleton: React.FC = () => {
  return (
    <Card variant="default" bordered className="mb-3 h-100 custom-card">
      {/* Image Skeleton */}
      <div className="card-image">
        <Placeholder
          as="div"
          animation="wave"
          className="w-100 h-100 rounded mb-1"
          style={{ minHeight: 160 }}
        />
      </div>

      {/* Content */}
      <div className="px-2 pt-2">
        {/* Title */}
        <Placeholder as="h6" animation="wave" className="mb-2">
          <Placeholder xs={8} />
        </Placeholder>

        {/* Description */}
        <Placeholder as="p" animation="wave" className="mb-2">
          <Placeholder xs={10} /> <Placeholder xs={6} />
        </Placeholder>

        {/* Email */}
        <Placeholder as="p" animation="wave" className="mb-1">
          <Placeholder xs={7} />
        </Placeholder>

        {/* Date */}
        <div className="d-flex justify-content-between align-items-center">
          <Placeholder as="small" animation="wave">
            <Placeholder xs={4} />
          </Placeholder>
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center gap-1 mt-2 mb-1 pt-2 border-top">
          {/* Status */}
          <Placeholder animation="wave">
            <Placeholder xs={5} style={{ height: 20 }} />
          </Placeholder>

          {/* Actions */}
          <div className="d-flex gap-1">
            <Placeholder.Button
              variant="secondary"
              size="sm"
              style={{ width: 32 }}
            />
            <Placeholder.Button
              variant="secondary"
              size="sm"
              style={{ width: 32 }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CommonCardSkeleton;
